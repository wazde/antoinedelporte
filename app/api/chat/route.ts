import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { answerLocally, PUBLIC_PROFILE_CONTEXT } from "@/lib/profile-knowledge";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

// Rate limit simple en mémoire par IP (protège le quota gratuit)
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

async function callGroq(apiKey: string, model: string, messages: IncomingMessage[]) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        { role: "system", content: PUBLIC_PROFILE_CONTEXT },
        ...messages.map((m) => ({
          role: m.role,
          content: String(m.content).slice(0, 800),
        })),
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`[chat] Groq ${model} HTTP ${res.status}:`, errText.slice(0, 300));
    return { text: null, reason: `http_${res.status}` };
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) return { text: null, reason: "empty_text" };
  return { text, reason: "ok" };
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

  if (!text) return { text: null, reason: "empty_text" };
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
    const reasons: string[] = [];

    // 1. Groq (gratuit sans CB : ajoute GROQ_API_KEY sur Vercel)
    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (groqKey) {
      const groqModels = process.env.GROQ_MODEL
        ? [process.env.GROQ_MODEL.trim()]
        : ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

      for (const model of groqModels) {
        const result = await callGroq(groqKey, model, messages);
        if (result.text) {
          const local = answerLocally(question, lang);
          return NextResponse.json({
            reply: result.text,
            links: local.links,
            mode: "live",
            provider: "groq",
            model,
          });
        }
        reasons.push(`groq:${model}:${result.reason}`);
      }
    }

    // 2. Gemini (si GEMINI_API_KEY est configurée avec facturation)
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    if (geminiKey) {
      const models = process.env.GEMINI_MODEL
        ? [process.env.GEMINI_MODEL.trim()]
        : ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];

      if (cachedDiscoveredModel && !models.includes(cachedDiscoveredModel)) {
        models.unshift(cachedDiscoveredModel);
      }

      for (const model of models) {
        const result = await callGemini(geminiKey, model, messages);
        if (result.text) {
          const local = answerLocally(question, lang);
          return NextResponse.json({
            reply: result.text,
            links: local.links,
            mode: "live",
            provider: "gemini",
            model,
          });
        }
        reasons.push(`gemini:${model}:${result.reason}`);
      }

      const discovered = await discoverFlashModel(geminiKey);
      if (discovered && !models.includes(discovered)) {
        const result = await callGemini(geminiKey, discovered, messages);
        if (result.text) {
          const local = answerLocally(question, lang);
          return NextResponse.json({
            reply: result.text,
            links: local.links,
            mode: "live",
            provider: "gemini",
            model: discovered,
          });
        }
        reasons.push(`gemini:${discovered}:${result.reason}`);
      }
    }

    if (!groqKey && !geminiKey) reasons.push("no_key");

    // 3. Fallback local instantané
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
