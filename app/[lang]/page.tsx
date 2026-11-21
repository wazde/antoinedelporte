import Link from "next/link";
import { dictionaries, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";
import styles from "./page.module.css";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const t = dictionaries[lang];
  const projects = await getProjects(lang);

  return (
    <div className="container">
      <section className={styles.hero}>
        <p className={styles.kicker}>{t.home.kicker}</p>
        <h1 className={styles.title}>
          {t.home.title} <em>{t.home.titleItalic}</em>
        </h1>
        <p className={styles.intro}>{t.home.intro}</p>

        <dl className={styles.pillars}>
          {t.home.pillars.map((p) => (
            <div key={p.label} className={styles.pillar}>
              <dt>{p.label}</dt>
              <dd>{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="work" className={styles.workSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t.home.selected}</h2>
          <span className={styles.sectionCount}>0{projects.length}</span>
        </div>

        <ul className={styles.list}>
          {projects.map(({ slug, meta }, index) => (
            <li key={slug}>
              <Link href={`/${lang}/work/${slug}`} className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardIndex}>0{index + 1}</span>
                  <span>{meta.year}</span>
                  <span className={styles.dot}>·</span>
                  <span>{meta.role}</span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{meta.title}</h3>
                  <p className={styles.cardSummary}>{meta.summary}</p>
                </div>

                <div className={styles.cardFooter}>
                  <ul className={styles.tags}>
                    {meta.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span className={styles.cardCta}>
                    {t.home.readCase} <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
