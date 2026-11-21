import type { Metadata } from "next";
import Link from "next/link";
import { dictionaries, isLocale, locales, type Locale } from "@/lib/i18n";
import { getProject, getProjectSlugs } from "@/lib/projects";
import styles from "./case-study.module.css";

// Génère une page par étude de cas et par langue au moment du build
export function generateStaticParams() {
  return locales.flatMap((lang) => getProjectSlugs().map((slug) => ({ lang, slug })));
}
export const dynamicParams = false;

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const { meta } = await getProject(slug, isLocale(lang) ? lang : "fr");
  return { title: meta.title, description: meta.summary };
}

export default async function CaseStudy({ params }: Props) {
  const { lang, slug } = await params;
  const t = dictionaries[lang as Locale];
  const { Content, meta } = await getProject(slug, lang as Locale);

  return (
    <article className={`container ${styles.article}`}>
      <Link href={`/${lang}#work`} className={`link ${styles.back}`}>
        {t.caseStudy.back}
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.summary}>{meta.summary}</p>
        <dl className={styles.facts}>
          <div>
            <dt>{t.caseStudy.role}</dt>
            <dd>{meta.role}</dd>
          </div>
          <div>
            <dt>{t.caseStudy.year}</dt>
            <dd>{meta.year}</dd>
          </div>
        </dl>
      </header>

      <div className={styles.prose}>
        <Content />
      </div>
    </article>
  );
}
