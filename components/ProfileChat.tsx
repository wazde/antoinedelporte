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
  onClose,
}: {
  lang: Locale;
  t: Dictionary;
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "local" | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

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
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden />
          {mode === "live" ? t.chat.modeLive : t.chat.assistant}
        </span>

        <div className={styles.headerActions}>
          {hasConversation && (
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => setMessages([])}
            >
              {t.chat.reset}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label={lang === "fr" ? "Fermer le panel" : "Close panel"}
              title={lang === "fr" ? "Replier le panel" : "Collapse panel"}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div ref={threadRef} className={styles.panelBody} role="log" aria-live="polite">
        {hasConversation ? (
          <div className={styles.thread}>
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
        ) : (
          <div className={styles.welcome}>
            <h2 className={styles.welcomeTitle}>
              {t.chat.heading} <em>{t.chat.headingItalic}</em>
            </h2>
            <p className={styles.welcomeSub}>{t.chat.subtitle}</p>
            <div className={styles.emptyPrompts}>
              {t.chat.prompts.map((prompt) => (
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
        )}
      </div>

      <div className={styles.panelFooter}>
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
      </div>
    </div>
  );
}
