import type { Locale } from "./i18n";

export type ViewMode = "chat" | "editorial" | "express" | "system";
export type VisitorIntent = "recruit" | "peer" | "ai" | "curious";

export type AdaptivePrefs = {
  intent: VisitorIntent;
  view: ViewMode;
};

export const STORAGE_KEY = "ad_portfolio_prefs_v1";

export const adaptiveCopy = {
  fr: {
    wizard: {
      kicker: "Expérience adaptative · 3 clics",
      title: "Adaptez ce portfolio à",
      titleItalic: "votre façon de lire.",
      subtitle:
        "Parce que l'IA permet enfin de sortir des interfaces figées, choisissez comment vous souhaitez découvrir le profil d'Antoine Delporte.",
      skip: "Passer et voir le site →",
      back: "← Retour",
      stepLabel: ["01 / 03 · Langue", "02 / 03 · Contexte", "03 / 03 · Format"],
      q1: "Dans quelle langue préférez-vous parcourir le site ?",
      q2: "Qu'est-ce qui vous amène ici aujourd'hui ?",
      q3: "Comment aimez-vous parcourir un portfolio ?",
    },
    intents: {
      recruit: {
        label: "Recruter / évaluer le profil",
        short: "Recrutement",
        desc: "Poste Lead Product Designer, full remote, impact & parcours.",
        angle:
          "Synthèse orientée impact : près de 10 ans en SaaS B2B complexe, encadrement d'équipe par le craft, et autonomisation des squads produit par le Design System et l'IA.",
        prompts: [
          "Quel est son parcours et son rôle actuel ?",
          "Quelle est sa façon de manager une équipe design ?",
          "Est-il disponible en full remote ?",
          "Quels résultats concrets a-t-il obtenus ?",
        ],
      },
      ai: {
        label: "Explorer son approche IA & Design Ops",
        short: "IA & Design Ops",
        desc: "Serveurs MCP, workflows multi-agents, Design System & code.",
        angle:
          "Focus architecture Design Ops : comment relier Figma, design tokens et codebases React/Vue 3 via des serveurs MCP et des garde-fous Discovery first.",
        prompts: [
          "Comment travaille-t-il avec l'IA et les serveurs MCP ?",
          "Comment évite-t-il le skip-discovery avec l'IA ?",
          "Est-ce qu'il prototype vraiment dans le code ?",
          "Comment outille-t-il les PM et développeurs ?",
        ],
      },
      peer: {
        label: "Échanger entre pairs Design / Produit",
        short: "Pair Design / Produit",
        desc: "Démarche UX, Discovery, leadership et craft au quotidien.",
        angle:
          "Regard de pair à pair : culture Discovery first, psychologie & réassurance sur des flux critiques, et leadership de pratique sans posture hiérarchique.",
        prompts: [
          "Quelle est sa philosophie de Product Discovery ?",
          "Comment aborde-t-il la réassurance UX sur des flux complexes ?",
          "Quelle est sa façon de manager une équipe design ?",
          "Comment collabore-t-il avec les PM et la tech ?",
        ],
      },
      curious: {
        label: "Juste curieux",
        short: "Découverte",
        desc: "Tour d'horizon libre du profil et des projets.",
        angle:
          "Lead Product Designer basé à Lille (full remote), profil hybride entre vision produit, design system et code augmenté par l'IA.",
        prompts: [
          "Présente-moi Antoine en 3 points clés",
          "Comment travaille-t-il avec l'IA et les serveurs MCP ?",
          "Quel est son parcours ?",
          "Est-ce qu'il code vraiment ?",
        ],
      },
    },
    views: {
      chat: {
        label: "Discussion",
        badge: "Chat IA",
        desc: "Posez vos questions directement dans un fil conversationnel.",
      },
      editorial: {
        label: "Lecture",
        badge: "Éditorial",
        desc: "Une mise en page posée, structurée, avec études de cas complètes.",
      },
      express: {
        label: "Express 30s",
        badge: "Scan rapide",
        desc: "L'essentiel en un coup d'œil : chiffres, parcours, stack et CV.",
      },
      system: {
        label: "Système",
        badge: "Tokens & Ops",
        desc: "Inspectez les design tokens, la typo et l'architecture Design Ops.",
      },
    },
    bar: {
      viewLabel: "Vue",
      reconfigure: "Personnaliser",
    },
    express: {
      kicker: "Vue Express · 30 secondes",
      title: "Antoine Delporte en bref.",
      facts: [
        { k: "Rôle", v: "Lead Product Designer" },
        { k: "Expérience", v: "~10 ans en SaaS B2B" },
        { k: "Spécialité", v: "Design Systems & Design Ops IA (MCP)" },
        { k: "Localisation", v: "Lille · Full Remote" },
        { k: "Stacks", v: "Figma, Tokens, React, Vue 3" },
        { k: "Langues", v: "Français (natif) · Anglais (pro)" },
      ],
      timelineTitle: "Parcours condensé",
      projectsTitle: "Études de cas (1 ligne)",
      ctaContact: "Écrire à Antoine",
      ctaCv: "Télécharger le CV (PDF)",
      ctaAbout: "Lire l'À propos complet →",
    },
    system: {
      kicker: "Vue Système · Design Tokens & Architecture",
      title: "Sous le capot du portfolio & de la pratique Design Ops.",
      subtitle:
        "Cliquez sur un token de couleur pour copier son code hex. Cette vue illustre la manière dont Antoine relie design, tokens et code.",
      copied: "Copié",
      tokensTitle: "01 · Tokens de couleur actifs",
      typoTitle: "02 · Échelle typographique",
      archTitle: "03 · Pipeline Design Ops augmenté par l'IA",
      archSteps: [
        { step: "01", name: "Discovery first", detail: "Analytics, personas, objectifs métier (garde-fous avant toute UI)" },
        { step: "02", name: "Source de vérité", detail: "Bibliothèque Figma, design tokens, règles d'assemblage" },
        { step: "03", name: "Serveur MCP", detail: "Exposition structurée du système aux agents (React / Vue 3)" },
        { step: "04", name: "Checks déterministes", detail: "Validation tokens, accessibilité et conformité avant merge" },
      ],
      projectsTitle: "04 · Index des études de cas (métadonnées)",
    },
  },
  en: {
    wizard: {
      kicker: "Adaptive experience · 3 clicks",
      title: "Tailor this portfolio to",
      titleItalic: "how you like to browse.",
      subtitle:
        "Because AI lets us move beyond one-size-fits-all interfaces, pick how you want to explore Antoine Delporte's profile.",
      skip: "Skip to site →",
      back: "← Back",
      stepLabel: ["01 / 03 · Language", "02 / 03 · Context", "03 / 03 · Reading mode"],
      q1: "Which language do you prefer?",
      q2: "What brings you here today?",
      q3: "How do you prefer to explore a portfolio?",
    },
    intents: {
      recruit: {
        label: "Hiring / evaluating the profile",
        short: "Hiring",
        desc: "Lead Product Designer role, full remote, impact & track record.",
        angle:
          "Impact-focused summary: nearly 10 years in complex B2B SaaS, craft-led team leadership, and empowering product squads through Design Systems and AI.",
        prompts: [
          "What's his background and current role?",
          "What is his leadership style?",
          "Is he open to full-remote roles?",
          "What concrete outcomes has he delivered?",
        ],
      },
      ai: {
        label: "Exploring his AI & Design Ops setup",
        short: "AI & Design Ops",
        desc: "MCP servers, multi-agent workflows, Design Systems & code.",
        angle:
          "Design Ops architecture lens: wiring Figma, design tokens, and React/Vue 3 codebases through MCP servers and Discovery-first guardrails.",
        prompts: [
          "How does he use AI and MCP servers?",
          "How does he prevent skip-discovery with AI?",
          "Does he actually prototype in code?",
          "How does he empower PMs and engineers?",
        ],
      },
      peer: {
        label: "Connecting as a Design / Product peer",
        short: "Design / Product peer",
        desc: "UX craft, Discovery methodology, leadership and daily practice.",
        angle:
          "Peer-to-peer lens: Discovery-first culture, cognitive reassurance on critical flows, and hands-on craft leadership without top-down hierarchy.",
        prompts: [
          "What is his Product Discovery philosophy?",
          "How does he design UX reassurance for complex errors?",
          "What is his leadership style?",
          "How does he collaborate with PMs and engineering?",
        ],
      },
      curious: {
        label: "Just exploring",
        short: "Exploring",
        desc: "Open tour of the profile, method and case studies.",
        angle:
          "Lead Product Designer based near Lille (full remote), bridging product vision, Design Systems, and AI-augmented code workflows.",
        prompts: [
          "Summarize Antoine in 3 key points",
          "How does he use AI and MCP servers?",
          "What's his background?",
          "Does he prototype in code?",
        ],
      },
    },
    views: {
      chat: {
        label: "Chat",
        badge: "AI Chat",
        desc: "Ask questions directly in a conversational thread.",
      },
      editorial: {
        label: "Editorial",
        badge: "Reading",
        desc: "Calm, structured layout with full narrative and case studies.",
      },
      express: {
        label: "Express 30s",
        badge: "Fast scan",
        desc: "Everything at a glance: key facts, timeline, stack and resume.",
      },
      system: {
        label: "System",
        badge: "Tokens & Ops",
        desc: "Inspect live design tokens, typography and Design Ops architecture.",
      },
    },
    bar: {
      viewLabel: "View",
      reconfigure: "Customize",
    },
    express: {
      kicker: "Express view · 30 seconds",
      title: "Antoine Delporte at a glance.",
      facts: [
        { k: "Role", v: "Lead Product Designer" },
        { k: "Experience", v: "~10 years in B2B SaaS" },
        { k: "Specialty", v: "Design Systems & AI Design Ops (MCP)" },
        { k: "Location", v: "Lille, France · Full Remote" },
        { k: "Stacks", v: "Figma, Tokens, React, Vue 3" },
        { k: "Languages", v: "French (native) · English (working)" },
      ],
      timelineTitle: "Condensed timeline",
      projectsTitle: "Case studies (1-liners)",
      ctaContact: "Email Antoine",
      ctaCv: "Download Resume (PDF)",
      ctaAbout: "Read full About page →",
    },
    system: {
      kicker: "System view · Design Tokens & Architecture",
      title: "Under the hood of the portfolio & Design Ops practice.",
      subtitle:
        "Click any color token to copy its hex value. This view reflects how Antoine bridges design, tokens, and code.",
      copied: "Copied",
      tokensTitle: "01 · Active color tokens",
      typoTitle: "02 · Typography scale",
      archTitle: "03 · AI-augmented Design Ops pipeline",
      archSteps: [
        { step: "01", name: "Discovery first", detail: "Analytics, personas, business goals (guardrails before UI)" },
        { step: "02", name: "Source of truth", detail: "Figma library, design tokens, composition rules" },
        { step: "03", name: "MCP Server", detail: "Structured system exposure to AI agents (React / Vue 3)" },
        { step: "04", name: "Deterministic checks", detail: "Token, accessibility & compliance validation before merge" },
      ],
      projectsTitle: "04 · Case study index (metadata)",
    },
  },
} as const;

export function getAdaptiveCopy(lang: Locale) {
  return adaptiveCopy[lang];
}
