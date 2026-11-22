"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

type Theme = "light" | "dark";

function resolveSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore storage errors
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const pathname = usePathname();
  // null tant qu'on ne connaît pas le thème (évite un décalage serveur/navigateur)
  const [theme, setTheme] = useState<Theme | null>(null);

  // Réapplique toujours le thème mémorisé après une navigation (/fr <-> /en)
  useEffect(() => {
    const current = resolveSavedTheme();
    document.documentElement.dataset.theme = current;
    setTheme(current);
  }, [pathname]);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
    setTheme(next);
  }

  const label = theme === "dark" ? labels.toLight : labels.toDark;

  return (
    <button type="button" className={styles.iconButton} onClick={toggle} aria-label={label} title={label}>
      <span aria-hidden>{theme === null ? "" : theme === "dark" ? "☀︎" : "☾"}</span>
    </button>
  );
}
