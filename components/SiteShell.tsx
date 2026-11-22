"use client";

import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import ProfileChat from "./ProfileChat";
import styles from "./SiteShell.module.css";

export default function SiteShell({
  lang,
  t,
  children,
}: {
  lang: Locale;
  t: Dictionary;
  children: React.ReactNode;
}) {
  // Ouvert par défaut sur desktop ; sur mobile/tablette s'ouvre via le bouton flottant
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`${styles.shell} ${desktopOpen ? styles.withPanel : ""}`}>
      <div className={styles.mainColumn}>{children}</div>

      {/* Overlay mobile quand le tiroir est ouvert */}
      {mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Panel IA fixé à droite sur toute la hauteur */}
      <aside
        className={`${styles.sidePanel} ${desktopOpen ? styles.panelDesktopOpen : styles.panelDesktopClosed} ${mobileOpen ? styles.panelMobileOpen : ""}`}
        aria-label={t.chat.ariaLabel}
      >
        <ProfileChat
          lang={lang}
          t={t}
          onClose={() => {
            setDesktopOpen(false);
            setMobileOpen(false);
          }}
        />
      </aside>

      {/* Bouton flottant pour rouvrir le panel (desktop quand replié, ou mobile) */}
      <button
        type="button"
        onClick={() => {
          setDesktopOpen(true);
          setMobileOpen(true);
        }}
        className={`${styles.fab} ${desktopOpen ? styles.fabDesktopHidden : ""} ${mobileOpen ? styles.fabHidden : ""}`}
      >
        <span className={styles.fabDot} aria-hidden />
        {lang === "fr" ? "Discuter avec l'IA" : "Ask AI"}
      </button>
    </div>
  );
}
