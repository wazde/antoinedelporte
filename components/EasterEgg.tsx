"use client";

import { useEffect, useState } from "react";
import styles from "./EasterEgg.module.css";

// Le célèbre Konami code : ↑ ↑ ↓ ↓ ← → ← → B A
const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function EasterEgg({ message }: { message: string }) {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    // Un petit mot pour les curieux qui ouvrent la console 👀
    console.log("%c👋 Psst… essaie ↑ ↑ ↓ ↓ ← → ← → B A", "font-size:14px;color:#ff5b2e");

    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === CODE[progress] ? progress + 1 : key === CODE[0] ? 1 : 0;
      if (progress === CODE.length) {
        progress = 0;
        const root = document.documentElement;
        const on = root.dataset.party !== "true";
        root.dataset.party = String(on);
        if (on) {
          setToast(true);
          setTimeout(() => setToast(false), 3500);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return toast ? (
    <div className={styles.toast} role="status">
      {message}
    </div>
  ) : null;
}
