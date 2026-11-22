"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { ProjectMeta } from "@/lib/projects";
import {
  getAdaptiveCopy,
  STORAGE_KEY,
  type AdaptivePrefs,
  type ViewMode,
  type VisitorIntent,
} from "@/lib/adaptive";
import { site } from "@/lib/site";
import ProfileChat from "./ProfileChat";
import styles from "./AdaptivePortfolio.module.css";

export type ProjectSummary = {
  slug: string;
  meta: ProjectMeta;
};

const VIEW_ORDER: ViewMode[] = ["chat", "editorial", "express", "system"];
const INTENT_ORDER: VisitorIntent[] = ["recruit", "ai", "peer", "curious"];

const COLOR_TOKENS = [
  { token: "--bg", name: "white_smoke", light: "#eff1ed", dark: "#16180d" },
  { token: "--bg-subtle", name: "dry_sage / khaki", light: "#e4e4d0", dark: "#212413" },
  { token: "--heading", name: "dark_khaki", light: "#373d20", dark: "#f1f2e8" },
  { token: "--muted", name: "dusty_olive", light: "#5b6037", dark: "#b3b985" },
  { token: "--accent", name: "ash_brown", light: "#766153", dark: "#b29e92" },
  { token: "--sage", name: "dry_sage", light: "#bcbd8b", dark: "#717744" },
];

export default function AdaptivePortfolio({
  lang,
  t,
  projects,
}: {
  lang: Locale;
  t: Dictionary;
  projects: ProjectSummary[];
}) {
  const router = useRouter();
  const copy = getAdaptiveCopy(lang);

  const [ready, setReady] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [prefs, setPrefs] = useState<AdaptivePrefs>({ intent: "curious", view: "chat" });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get("view") as ViewMode | null;
      const urlStep = params.get("step");

      if (urlStep === "2") {
        setShowWizard(true);
        setStep(1);
        setReady(true);
        return;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AdaptivePrefs>;
        const next: AdaptivePrefs = {
          intent: parsed.intent && INTENT_ORDER.includes(parsed.intent) ? parsed.intent : "curious",
          view:
            urlView && VIEW_ORDER.includes(urlView)
              ? urlView
              : parsed.view && VIEW_ORDER.includes(parsed.view)
                ? parsed.view
                : "chat",
        };
        setPrefs(next);
        setShowWizard(false);
      } else if (urlView && VIEW_ORDER.includes(urlView)) {
        setPrefs({ intent: "curious", view: urlView });
        setShowWizard(false);
      } else {
        setShowWizard(true);
        setStep(0);
      }
    } catch {
      setShowWizard(false);
    } finally {
      setReady(true);
    }
  }, []);

  function savePrefs(next: AdaptivePrefs) {
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }

  function chooseLanguage(target: Locale) {
    if (target !== lang) {
      router.push(`/${target}?step=2`);
    } else {
      setStep(1);
    }
  }

  function chooseIntent(intent: VisitorIntent) {
    setPrefs((prev) => ({ ...prev, intent }));
    setStep(2);
  }

  function chooseView(view: ViewMode) {
    const next = { ...prefs, view };
    savePrefs(next);
    setShowWizard(false);
    if (window.location.search) {
      router.replace(`/${lang}`, { scroll: false });
    }
  }

  function skipWizard() {
    savePrefs(prefs);
    setShowWizard(false);
    if (window.location.search) {
      router.replace(`/${lang}`, { scroll: false });
    }
  }

  function switchView(view: ViewMode) {
    savePrefs({ ...prefs, view });
  }

  function copyHex(token: string, hex: string) {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken((curr) => (curr === token ? null : curr)), 1500);
  }

  const intentData = copy.intents[prefs.intent];

  // Évite un flash avant lecture de localStorage
  if (!ready) {
    return (
      <div className="container">
        <div className={styles.loadingSpacer} />
      </div>
    );
  }

  // ---------- MINI WIZARD (3 CLICS) ----------
  if (showWizard) {
    return (
      <div className="container">
        <section className={styles.wizardSection} aria-label={copy.wizard.kicker}>
          <div className={styles.wizardCard}>
            <div className={styles.wizardTop}>
              <span className={styles.wizardStep}>{copy.wizard.stepLabel[step]}</span>
              <button type="button" onClick={skipWizard} className={styles.skipBtn}>
                {copy.wizard.skip}
              </button>
            </div>

            <div className={styles.wizardHeader}>
              <div className={styles.wizardHeaderRow}>
                <div>
                  <p className={styles.kicker}>{copy.wizard.kicker}</p>
                  <h1 className={styles.wizardTitle}>
                    {copy.wizard.title} <em>{copy.wizard.titleItalic}</em>
                  </h1>
                  <p className={styles.wizardSubtitle}>{copy.wizard.subtitle}</p>
                </div>
                <img
                  src="/illustrations/chat-bot.jpg"
                  alt=""
                  width={120}
                  height={120}
                  className={styles.stampLg}
                />
              </div>
            </div>

            <div className={styles.wizardBody}>
              {step === 0 && (
                <>
                  <h2 className={styles.question}>{copy.wizard.q1}</h2>
                  <div className={styles.optionsGrid2}>
                    <button
                      type="button"
                      onClick={() => chooseLanguage("fr")}
                      className={styles.optionCard}
                    >
                      <span className={styles.optionTitle}>Français</span>
                      <span className={styles.optionDesc}>Parcourir le portfolio en français</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseLanguage("en")}
                      className={styles.optionCard}
                    >
                      <span className={styles.optionTitle}>English</span>
                      <span className={styles.optionDesc}>Browse the portfolio in English</span>
                    </button>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className={styles.question}>{copy.wizard.q2}</h2>
                  <div className={styles.optionsGrid2}>
                    {INTENT_ORDER.map((id) => {
                      const item = copy.intents[id];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => chooseIntent(id)}
                          className={styles.optionCard}
                        >
                          <span className={styles.optionTitle}>{item.label}</span>
                          <span className={styles.optionDesc}>{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => setStep(0)} className={styles.backBtn}>
                    {copy.wizard.back}
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className={styles.question}>{copy.wizard.q3}</h2>
                  <div className={styles.optionsGrid2}>
                    {VIEW_ORDER.map((id) => {
                      const item = copy.views[id];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => chooseView(id)}
                          className={styles.optionCard}
                        >
                          <div className={styles.optionHead}>
                            <span className={styles.optionTitle}>{item.label}</span>
                            <span className={styles.optionBadge}>{item.badge}</span>
                          </div>
                          <span className={styles.optionDesc}>{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>
                    {copy.wizard.back}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ---------- BARRE DE CONTRÔLE ADAPTATIVE + VUE CHOISIE ----------
  return (
    <div className="container">
      <div className={styles.controlBar} role="region" aria-label={copy.bar.viewLabel}>
        <div className={styles.modeTabs} role="tablist">
          {VIEW_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={prefs.view === id}
              onClick={() => switchView(id)}
              className={`${styles.modeTab} ${prefs.view === id ? styles.modeTabActive : ""}`}
            >
              {copy.views[id].label}
            </button>
          ))}
        </div>

        <div className={styles.barRight}>
          <span className={styles.intentPill}>{intentData.short}</span>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setShowWizard(true);
            }}
            className={styles.reconfigBtn}
          >
            {copy.bar.reconfigure} ↻
          </button>
        </div>
      </div>

      {/* VUE 1 : DISCUSSION (CHAT IA) */}
      {prefs.view === "chat" && (
        <>
          <ProfileChat
            lang={lang}
            t={t}
            customPrompts={intentData.prompts}
            customSubtitle={intentData.angle}
          />
          <CaseStudiesList lang={lang} t={t} projects={projects} />
        </>
      )}

      {/* VUE 2 : LECTURE (ÉDITORIAL CLASSIQUE) */}
      {prefs.view === "editorial" && (
        <>
          <section className={styles.editorialHero}>
            <p className={styles.kicker}>{t.home.kicker}</p>
            <h1 className={styles.editorialTitle}>
              {t.home.title} <em>{t.home.titleItalic}</em>
            </h1>
            <p className={styles.editorialIntro}>{intentData.angle}</p>

            <dl className={styles.pillars}>
              {t.home.pillars.map((p) => (
                <div key={p.label} className={styles.pillar}>
                  <dt>{p.label}</dt>
                  <dd>{p.text}</dd>
                </div>
              ))}
            </dl>
          </section>
          <CaseStudiesList lang={lang} t={t} projects={projects} />
        </>
      )}

      {/* VUE 3 : EXPRESS 30s (SCAN RECRUTEUR) */}
      {prefs.view === "express" && (
        <section className={styles.expressSection}>
          <div className={styles.expressHeader}>
            <div>
              <p className={styles.kicker}>{copy.express.kicker}</p>
              <h1 className={styles.compactTitle}>{copy.express.title}</h1>
              <p className={styles.compactSub}>{intentData.angle}</p>
            </div>
            <div className={styles.expressActions}>
              <a href={`mailto:${site.email}`} className={styles.primaryCta}>
                {copy.express.ctaContact} →
              </a>
              <a href={site.cv[lang]} download className={styles.secondaryCta}>
                {copy.express.ctaCv} ↓
              </a>
            </div>
          </div>

          <dl className={styles.factsGrid}>
            {copy.express.facts.map((f) => (
              <div key={f.k} className={styles.factCell}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.expressColumns}>
            <div className={styles.expressBlock}>
              <h2 className={styles.smallHeading}>{copy.express.timelineTitle}</h2>
              <ul className={styles.compactTimeline}>
                {t.about.trajectories.map((item) => (
                  <li key={item.period}>
                    <span className={styles.timelinePeriod}>{item.period}</span>
                    <strong>{item.role}</strong>
                    <span className={styles.timelineCtx}>{item.context}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${lang}/about`} className={`link ${styles.inlineMore}`}>
                {copy.express.ctaAbout}
              </Link>
            </div>

            <div className={styles.expressBlock}>
              <h2 className={styles.smallHeading}>{copy.express.projectsTitle}</h2>
              <ul className={styles.oneLineProjects}>
                {projects.map(({ slug, meta }, i) => (
                  <li key={slug}>
                    <Link href={`/${lang}/work/${slug}`} className={styles.oneLineLink}>
                      <span className={styles.monoIdx}>0{i + 1}</span>
                      <div>
                        <strong>{meta.title}</strong>
                        <p>{meta.summary}</p>
                      </div>
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* VUE 4 : SYSTÈME (DESIGN TOKENS & ARCHITECTURE) */}
      {prefs.view === "system" && (
        <section className={styles.systemSection}>
          <div className={styles.systemHeader}>
            <div className={styles.systemHeaderRow}>
              <div>
                <p className={styles.kicker}>{copy.system.kicker}</p>
                <h1 className={styles.compactTitle}>{copy.system.title}</h1>
                <p className={styles.compactSub}>{copy.system.subtitle}</p>
              </div>
              <img
                src="/illustrations/design-system.jpg"
                alt=""
                width={136}
                height={136}
                className={styles.stampLg}
              />
            </div>
          </div>

          <div className={styles.systemBlock}>
            <h2 className={styles.smallHeading}>{copy.system.tokensTitle}</h2>
            <div className={styles.tokenGrid}>
              {COLOR_TOKENS.map((tok) => (
                <button
                  key={tok.token}
                  type="button"
                  onClick={() => copyHex(tok.token, tok.light)}
                  className={styles.tokenCard}
                >
                  <span
                    className={styles.tokenSwatch}
                    style={{ background: `var(${tok.token})` }}
                  />
                  <div className={styles.tokenMeta}>
                    <span className={styles.tokenVar}>{tok.token}</span>
                    <span className={styles.tokenName}>
                      {copiedToken === tok.token
                        ? `✓ ${copy.system.copied}`
                        : `${tok.name} · ${tok.light} / ${tok.dark}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.systemBlock}>
            <h2 className={styles.smallHeading}>{copy.system.typoTitle}</h2>
            <div className={styles.typoSpec}>
              <div>
                <span className={styles.tokenVar}>--font-serif · Instrument Serif (400 / italic)</span>
                <p className={`serif ${styles.typoSampleSerif}`}>
                  Discovery first, <em>Design Systems &amp; MCP.</em>
                </p>
              </div>
              <div>
                <span className={styles.tokenVar}>--font-sans · Geist Sans (body &amp; UI)</span>
                <p className={styles.typoSampleSans}>
                  {intentData.angle}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.systemBlock}>
            <h2 className={styles.smallHeading}>{copy.system.archTitle}</h2>
            <ol className={styles.archGrid}>
              {copy.system.archSteps.map((s) => (
                <li key={s.step} className={styles.archCard}>
                  <span className={styles.archStep}>{s.step}</span>
                  <strong>{s.name}</strong>
                  <p>{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.systemBlock} id="work">
            <h2 className={styles.smallHeading}>{copy.system.projectsTitle}</h2>
            <div className={styles.metaTable}>
              {projects.map(({ slug, meta }, i) => (
                <Link key={slug} href={`/${lang}/work/${slug}`} className={styles.metaRow}>
                  <span className={styles.monoIdx}>0{i + 1}</span>
                  <span className={styles.metaTitle}>{meta.title}</span>
                  <span className={styles.metaTags}>{meta.tags.join(" · ")}</span>
                  <span className={styles.metaYear}>{meta.year} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function CaseStudiesList({
  lang,
  t,
  projects,
}: {
  lang: Locale;
  t: Dictionary;
  projects: ProjectSummary[];
}) {
  return (
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

              <div className={styles.cardMain}>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{meta.title}</h3>
                  <p className={styles.cardSummary}>{meta.summary}</p>
                </div>
                {meta.illustration && (
                  <img
                    src={meta.illustration}
                    alt=""
                    width={128}
                    height={128}
                    className={styles.cardIllust}
                  />
                )}
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
  );
}
