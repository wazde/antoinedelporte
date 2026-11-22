import Link from "next/link";
import { dictionaries, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";
import CyclingTitle from "@/components/CyclingTitle";
import ProfileChat from "@/components/ProfileChat";
import styles from "./page.module.css";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const t = dictionaries[lang];
  const projects = await getProjects(lang);
  const variants = [styles.folderDark, styles.folderLight, styles.folderDeep];

  return (
    <div className="container">
      {/* SPLIT HERO : Éditorial à gauche · Chat IA à droite */}
      <section className={styles.splitHero}>
        <div className={styles.editorialCol}>
          <p className={styles.kicker}>{t.home.kicker}</p>
          <CyclingTitle prefix={t.chat.heading} facets={t.chat.headingFacets} />
          <p className={styles.intro}>{t.home.intro}</p>

          <div className={styles.heroActions}>
            <a href="#work" className={styles.primaryCta}>
              {t.home.selected} ↓
            </a>
            <a href={site.cv[lang]} download className={styles.secondaryCta}>
              {t.footer.cv} ↓
            </a>
          </div>
        </div>

        <div className={styles.chatCol}>
          <ProfileChat lang={lang} t={t} />
        </div>
      </section>

      {/* 3 PILIERS ÉDITORIAUX */}
      <section className={styles.pillarsSection} aria-label="Principes">
        <dl className={styles.pillars}>
          {t.home.pillars.map((p) => (
            <div key={p.label} className={styles.pillar}>
              <dt>{p.label}</dt>
              <dd>{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 3 CARTES DOSSIER ANIMÉES (ÉTUDES DE CAS) */}
      <section id="work" className={styles.workSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t.home.selected}</h2>
          <span className={styles.sectionCount}>0{projects.length}</span>
        </div>

        <ul className={styles.folderGrid}>
          {projects.map(({ slug, meta }, index) => {
            const variant = variants[index % variants.length];
            return (
              <li key={slug}>
                <Link
                  href={`/${lang}/work/${slug}`}
                  className={`${styles.folderCard} ${variant}`}
                >
                  <div className={styles.folderBackdrop} />

                  <div className={styles.folderFlap}>
                    <svg
                      className={styles.folderTabSvg}
                      viewBox="0 0 400 44"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <path
                        d="M0,44 L0,20 Q0,0 20,0 L108,0 Q126,0 138,16 L146,28 Q156,40 174,40 L380,40 Q400,40 400,44 Z"
                        fill="currentColor"
                      />
                    </svg>

                    <div className={styles.folderBody}>
                      <div className={styles.folderTopRow}>
                        <span className={styles.folderNum}>0{index + 1}</span>
                        <span className={styles.folderArrow} aria-hidden>
                          ↗
                        </span>
                      </div>

                      <div className={styles.folderText}>
                        <h3 className={styles.folderTitle}>{meta.title}</h3>
                        <p className={styles.folderSummary}>{meta.summary}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
