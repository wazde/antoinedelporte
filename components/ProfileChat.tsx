"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { ChatLink } from "@/lib/profile-knowledge";
import styles from "./ProfileChat.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  links?: ChatLink[];
};

// Rendu léger du **gras** et des retours à la ligne sans dépendance externe
function renderFormatted(text: string) {
  return text.split("\n").map((line, lineIndex) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={lineIndex} className={styles.paragraph}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

export default function ProfileChat({
  lang,
  t,
  customPrompts,
  customSubtitle,
}: {
  lang: Locale;
  t: Dictionary;
  customPrompts?: readonly string[];
  customSubtitle?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "local" | null>(null);
  const [facetIdx, setFacetIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const facets = t.chat.headingFacets;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const intervalId = setInterval(() => {
      setFading(true);
      timeoutId = setTimeout(() => {
        setFacetIdx((prev) => (prev + 1) % facets.length);
        setFading(false);
      }, 360);
    }, 2800);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [facets.length]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function ask(rawQuestion: string) {
    const question = rawQuestion.trim();
    if (!question || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: question };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: nextHistory.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        links?: ChatLink[];
        mode?: "live" | "local";
        error?: string;
      };

      const replyText = data.reply || data.error || t.chat.error;
      if (data.mode) setMode(data.mode);

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: replyText,
          links: data.links,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", content: t.chat.error },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  const hasConversation = messages.length > 0;

  return (
    <section className={styles.hero} aria-label={t.chat.ariaLabel}>
      <div className={styles.intro}>
        <p className={styles.kicker}>{t.home.kicker}</p>
        <h1 className={styles.title}>
          {t.chat.heading}{" "}
          <em className={`${styles.cyclingFacet} ${fading ? styles.cyclingFacetOut : ""}`}>
            {facets[facetIdx]}
          </em>
        </h1>
        <p className={styles.subtitle}>{customSubtitle || t.chat.subtitle}</p>
      </div>

      <div className={styles.chatShell}>
        {hasConversation && (
          <div className={styles.threadHeader}>
            <span className={styles.status}>
              <span className={styles.statusDot} aria-hidden />
              {mode === "live" ? t.chat.modeLive : t.chat.modeLocal}
            </span>
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => setMessages([])}
            >
              {t.chat.reset}
            </button>
          </div>
        )}

        {hasConversation && (
          <div ref={threadRef} className={styles.thread} role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.role === "user" ? styles.userRow : styles.assistantRow}
              >
                <span className={styles.speaker}>
                  {msg.role === "user" ? t.chat.you : t.chat.assistant}
                </span>
                <div className={msg.role === "user" ? styles.userBubble : styles.assistantBubble}>
                  {renderFormatted(msg.content)}
                  {msg.links && msg.links.length > 0 && (
                    <div className={styles.links}>
                      {msg.links.map((item) =>
                        item.external || item.href.startsWith("mailto:") || item.href.endsWith(".pdf") ? (
                          <a
                            key={item.href}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            download={item.href.endsWith(".pdf") ? true : undefined}
                            className={styles.linkPill}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link key={item.href} href={item.href} className={styles.linkPill}>
                            {item.label}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className={styles.assistantRow}>
                <span className={styles.speaker}>{t.chat.assistant}</span>
                <div className={styles.thinking}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.composer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat.placeholder}
            aria-label={t.chat.placeholder}
            maxLength={500}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={styles.sendButton}
          >
            {t.chat.send} <span aria-hidden>↑</span>
          </button>
        </form>

        <div className={styles.prompts}>
          {(customPrompts ?? t.chat.prompts).map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={loading}
              onClick={() => void ask(prompt)}
              className={styles.promptChip}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <a href="#work" className={`link ${styles.scrollHint}`}>
        {t.chat.scrollToWork} <span aria-hidden>↓</span>
      </a>
    </section>
  );
}
