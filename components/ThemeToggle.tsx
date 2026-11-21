"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";

type Theme = "light" | "dark";

export default function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  // null tant qu'on ne connaît pas le thème (évite un décalage serveur/navigateur)
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme as Theme);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  const label = theme === "dark" ? labels.toLight : labels.toDark;

  return (
    <button type="button" className={styles.iconButton} onClick={toggle} aria-label={label} title={label}>
      <span aria-hidden>{theme === null ? "" : theme === "dark" ? "☀︎" : "☾"}</span>
    </button>
  );
}
