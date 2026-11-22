import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { answerLocally, PUBLIC_PROFILE_CONTEXT } from "@/lib/profile-knowledge";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

// Rate limit simple en mémoire par IP (protège le quota gratuit Gemini)
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;
const hits = new Map<string, { count: number; resetAt: number }>();

let cachedDiscoveredModel: string | null = null;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

async function callGemini(apiKey: string, model: string, messages: IncomingMessage[]) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content).slice(0, 800) }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: PUBLIC_PROFILE_CONTEXT }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`[chat] Gemini ${model} HTTP ${res.status}:`, errText.slice(0, 300));
    return { text: null, reason: `http_${res.status}` };
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts
    ?.filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!text) {
    console.error(`[chat] Gemini ${model} returned empty text`);
    return { text: null, reason: "empty_text" };
  }

  return { text, reason: "ok" };
}

async function discoverFlashModel(apiKey: string): Promise<string | null> {
  if (cachedDiscoveredModel) return cachedDiscoveredModel;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
    };
    const match = data.models?.find(
      (m) =>
        m.name &&
        m.name.includes("flash") &&
        !m.name.includes("image") &&
        !m.name.includes("audio") &&
        m.supportedGenerationMethods?.includes("generateContent"),
    );
    if (match?.name) {
      cachedDiscoveredModel = match.name.replace(/^models\//, "");
      return cachedDiscoveredModel;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes, réessaie dans une minute." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { messages?: IncomingMessage[]; lang?: string };
    const lang: Locale = body.lang && isLocale(body.lang) ? body.lang : "fr";
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");

    if (!lastUser || typeof lastUser.content !== "string" || !lastUser.content.trim()) {
      return NextResponse.json({ error: "Question vide." }, { status: 400 });
    }

    const question = lastUser.content.trim().slice(0, 500);
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const reasons: string[] = [];

    if (!apiKey) {
      reasons.push("no_key");
    } else {
      const models = process.env.GEMINI_MODEL
        ? [process.env.GEMINI_MODEL.trim()]
        : ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];

      if (cachedDiscoveredModel && !models.includes(cachedDiscoveredModel)) {
        models.unshift(cachedDiscoveredModel);
      }

      for (const model of models) {
        const result = await callGemini(apiKey, model, messages);
        if (result.text) {
          const local = answerLocally(question, lang);
          return NextResponse.json({
            reply: result.text,
            links: local.links,
            mode: "gemini",
            model,
          });
        }
        reasons.push(`${model}:${result.reason}`);
      }

      // Dernier recours : découvrir automatiquement un modèle Flash actif sur cette clé
      const discovered = await discoverFlashModel(apiKey);
      if (discovered && !models.includes(discovered)) {
        const result = await callGemini(apiKey, discovered, messages);
        if (result.text) {
          const local = answerLocally(question, lang);
          return NextResponse.json({
            reply: result.text,
            links: local.links,
            mode: "gemini",
            model: discovered,
          });
        }
        reasons.push(`${discovered}:${result.reason}`);
      }
    }

    const local = answerLocally(question, lang);
    return NextResponse.json({
      reply: local.reply,
      links: local.links,
      mode: "local",
      reason: reasons.join(", "),
    });
  } catch (err) {
    console.error("[chat] Unexpected error:", err);
    return NextResponse.json(
      { error: "Impossible de répondre pour le moment." },
      { status: 500 },
    );
  }
}
