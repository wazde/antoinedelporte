"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import styles from "./Header.module.css";

// Garde la même page en changeant juste la langue : /fr/about → /en/about
export default function LangSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const other: Locale = lang === "fr" ? "en" : "fr";
  const href = pathname.replace(/^\/(fr|en)/, `/${other}`);

  return (
    <Link href={href} className={styles.iconButton} hrefLang={other} aria-label={other === "en" ? "English" : "Français"}>
      {other}
    </Link>
  );
}
