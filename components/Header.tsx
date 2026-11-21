import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import styles from "./Header.module.css";

export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={`/${lang}`} className={styles.logo}>
          {site.name}
        </Link>
        <nav className={styles.nav}>
          <Link href={`/${lang}#work`} className="link">
            {t.nav.work}
          </Link>
          <Link href={`/${lang}/about`} className="link">
            {t.nav.about}
          </Link>
          <LangSwitch lang={lang} />
          <ThemeToggle labels={t.theme} />
        </nav>
      </div>
    </header>
  );
}
