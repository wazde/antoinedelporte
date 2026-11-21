"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

// Curseur custom : un point qui suit la souris et un anneau qui le rattrape en douceur.
// Désactivé sur écran tactile et si l'utilisateur préfère réduire les animations.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      // L'anneau grossit au survol d'un élément cliquable
      const target = e.target as HTMLElement;
      ring.current?.classList.toggle(styles.hover, !!target.closest("a, button"));
    };

    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      frame = requestAnimationFrame(loop);
    };

    const onDown = () => ring.current?.classList.add(styles.down);
    const onUp = () => ring.current?.classList.remove(styles.down);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    frame = requestAnimationFrame(loop);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={ring} className={styles.ring} aria-hidden>
        <span />
      </div>
      <div ref={dot} className={styles.dot} aria-hidden>
        <span />
      </div>
    </>
  );
}
