import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topRow}>
          <div>
            <p className={styles.contact}>{t.footer.contact}</p>
            <a href={`mailto:${site.email}`} className={`link ${styles.email}`}>
              {site.email}
            </a>
          </div>
          <img
            src="/illustrations/discovery.jpg"
            alt=""
            width={112}
            height={112}
            className={styles.footerStamp}
          />
        </div>

        <div className={styles.bottom}>
          <ul className={styles.socials}>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link">
                  {s.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href={site.cv[lang]} download className="link">
                {t.footer.cv} ↓
              </a>
            </li>
          </ul>
          <p className={styles.made}>
            © {new Date().getFullYear()} {site.name}. {t.footer.made}
          </p>
        </div>
      </div>
    </footer>
  );
}
