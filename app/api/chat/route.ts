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
    const apiKey = process.env.GEMINI_API_KEY;

    // Si une clé Gemini est configurée sur Vercel (ou .env.local), on appelle le vrai LLM
    if (apiKey) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
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
              maxOutputTokens: 320,
            },
          }),
        },
      );

      if (res.ok) {
        const data = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("")
          .trim();

        if (text) {
          // On réutilise les liens contextuels pertinents du matcher local si trouvés
          const local = answerLocally(question, lang);
          return NextResponse.json({
            reply: text,
            links: local.links,
            mode: "gemini",
          });
        }
      }
    }

    // Fallback instantané sans erreur si pas de clé ou quota atteint
    const local = answerLocally(question, lang);
    return NextResponse.json({
      reply: local.reply,
      links: local.links,
      mode: "local",
    });
  } catch {
    return NextResponse.json(
      { error: "Impossible de répondre pour le moment." },
      { status: 500 },
    );
  }
}
