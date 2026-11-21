import Link from "next/link";
import { dictionaries, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const t = dictionaries[lang];
  const projects = await getProjects(lang);

  return (
    <div className="container">
      <section className={styles.hero}>
        <p className={styles.hello}>
          {t.home.hello} {site.name} <span className={styles.wave}>👋</span>
        </p>
        <h1 className={styles.title}>{t.home.title}</h1>
        <p className={styles.intro}>{t.home.intro}</p>
      </section>

      <section id="work">
        <h2 className={styles.sectionTitle}>{t.home.selected}</h2>
        <ul className={styles.grid}>
          {projects.map(({ slug, meta }) => (
            <li key={slug}>
              <Link href={`/${lang}/work/${slug}`} className={styles.card} style={{ background: meta.color }}>
                <span className={styles.cardYear}>{meta.year}</span>
                <h3 className={styles.cardTitle}>{meta.title}</h3>
                <p className={styles.cardSummary}>{meta.summary}</p>
                <ul className={styles.tags}>
                  {meta.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <span className={styles.cardCta}>
                  {t.home.readCase} <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
