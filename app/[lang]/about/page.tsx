import type { Metadata } from "next";
import { dictionaries, isLocale, type Locale } from "@/lib/i18n";
import styles from "./about.module.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: dictionaries[isLocale(lang) ? lang : "fr"].about.title };
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const t = dictionaries[lang];

  return (
    <div className={`container ${styles.about}`}>
      <h1 className={styles.title}>{t.about.title}</h1>
      {t.about.body.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
