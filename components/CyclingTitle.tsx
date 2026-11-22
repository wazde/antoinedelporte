"use client";

import { useEffect, useState } from "react";
import styles from "./CyclingTitle.module.css";

export default function CyclingTitle({
  prefix,
  facets,
}: {
  prefix: string;
  facets: readonly string[];
}) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const intervalId = setInterval(() => {
      setFading(true);
      timeoutId = setTimeout(() => {
        setIdx((prev) => (prev + 1) % facets.length);
        setFading(false);
      }, 360);
    }, 2800);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [facets.length]);

  return (
    <h1 className={styles.title}>
      {prefix}{" "}
      <em className={`${styles.facet} ${fading ? styles.facetOut : ""}`}>
        {facets[idx]}
      </em>
    </h1>
  );
}
