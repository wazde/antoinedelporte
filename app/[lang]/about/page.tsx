import type { Metadata } from "next";
import { dictionaries, isLocale, type Locale } from "@/lib/i18n";
import styles from "./about.module.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: dictionaries[isLocale(lang) ? lang : "fr"].about.kicker };
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const t = dictionaries[lang];

  return (
    <div className={`container ${styles.about}`}>
      <div className={styles.heroRow}>
        <div>
          <p className={styles.kicker}>{t.about.kicker}</p>
          <h1 className={styles.title}>{t.about.title}</h1>
        </div>
        <img
          src="/illustrations/discovery.jpg"
          alt=""
          width={140}
          height={140}
          className={styles.illust}
        />
      </div>
      <p className={styles.lead}>{t.about.lead}</p>

      <div className={styles.prose}>
        {t.about.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <section className={styles.timeline}>
        <h2 className={styles.timelineTitle}>{t.about.trajectoriesTitle}</h2>
        <ul className={styles.timelineList}>
          {t.about.trajectories.map((item) => (
            <li key={item.period} className={styles.timelineItem}>
              <span className={styles.period}>{item.period}</span>
              <div>
                <strong className={styles.role}>{item.role}</strong>
                <span className={styles.context}>{item.context}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
