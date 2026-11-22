import type { Locale } from "./i18n";

export type ChatLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type LocalAnswer = {
  reply: string;
  links?: ChatLink[];
};

// Base de connaissances strictement publique (aucune info salariale, familiale, ni nom d'employeur actuel).
export const PUBLIC_PROFILE_CONTEXT = `
Tu es l'assistant du portfolio d'Antoine Delporte. Tu réponds aux visiteurs (recruteurs, VP Design, PM, fondateurs, pairs) qui veulent découvrir son profil.

RÈGLES STRICTES :
- Réponds dans la langue de la question (français ou anglais).
- Ton : direct, pragmatique, authentique, éditorial, sans blabla corporate ni superlatifs marketing.
- Sois concis (3 à 6 lignes maximum, structuré si utile).
- Ne mentionne JAMAIS de nom d'employeur (parle uniquement de "scale-up SaaS logistique & last-mile" et d'"éditeur SaaS B2B de géolocalisation et gestion de flotte").
- N'invente rien. Si une information n'est pas dans le profil ci-dessous (ex. prétentions salariales, vie privée, détails confidentiels), dis simplement que tu ne disposes pas de cette info et propose de contacter Antoine directement par email (contact@antoinedelporte.fr) ou LinkedIn.
- Si la question est hors-sujet, recadre avec bienveillance vers le profil d'Antoine.

PROFIL PUBLIC D'ANTOINE DELPORTE :
- Rôle : Lead Product Designer, ~10 ans d'expérience en conception de produits numériques B2B complexes.
- Localisation : métropole lilloise (France), disponible en full remote.
- Positionnement : Profil hybride entre vision produit, design et code, spécialisé en produits complexes, Design Systems et Design Ops augmentée par l'IA (conception de serveurs MCP et workflows multi-agents en production).
- Parcours :
  * 2016 – 2023 : ~8 ans sur des produits SaaS B2B de géolocalisation et gestion de flotte (Webdesigner en alternance → UX/UI Designer → Product Designer).
  * Janvier 2024 – présent : Scale-up SaaS logistique & last-mile (Product Designer puis Lead Product Designer depuis janvier 2026). Encadre une équipe pluridisciplinaire Product & Graphic Design.
- Leadership : Leadership par le craft et la pratique plutôt que hiérarchique descendant. Focus sur la vitesse d'exécution, la qualité d'expérience et la réduction des frictions avec les équipes techniques.
- Méthode ("Discovery first") : Opposé à la génération d'interfaces à l'aveugle (skip-discovery). Impose des garde-fous méthodologiques (analytics, personas, objectifs métier) avant d'accélérer la production avec l'IA.
- Forces clés :
  * Relier design et code sur des environnements multi-produits et multi-stacks (React, Vue 3) : bibliothèques Figma, design tokens, règles métier, serveurs MCP, vérifications déterministes pour encadrer les agents IA.
  * Prototypage direct dans la codebase, pipelines automatisés pour la User Research et l'analyse de données.
  * Sensibilité UX, pédagogie et psychologie : accompagner des utilisateurs non experts et travailler la réassurance émotionnelle et cognitive lors d'incidents techniques sur des flux critiques.
  * Autonomisation des non-designers (PM, développeurs, ops) pour livrer des écrans conformes au Design System tout en protégeant la bande passante de l'équipe Design.
- Langues : Français (langue maternelle), Anglais (très à l'aise à l'écrit, lecture et compréhension au quotidien en contexte produit/tech/IA, pratique orale régulière).
- Études de cas disponibles sur le site :
  1. "Agent Design System & serveur MCP" (/work/exemple-design-system)
  2. "Réassurance & gestion d'erreurs sur des flux logistiques critiques" (/work/exemple-reservation)
- Contact : contact@antoinedelporte.fr · LinkedIn : https://www.linkedin.com/in/antoinedelporte · GitHub : https://github.com/wazde
`;

type Topic = {
  keywords: string[];
  fr: LocalAnswer;
  en: LocalAnswer;
};

const TOPICS: Topic[] = [
  {
    keywords: ["ia", "ai", "mcp", "agent", "agents", "llm", "ops", "design ops", "workflow", "automatis", "vibe"],
    fr: {
      reply:
        "Antoine est spécialisé en Design Ops augmentée par l'IA : il conçoit des serveurs MCP et des workflows multi-agents branchés sur des sources de vérité fiables (Figma, design tokens, règles métier, React / Vue 3).\n\nSon principe : **Discovery first**. Jamais de génération d'écrans à l'aveugle — l'IA sert à outiller les PM et développeurs pour livrer des parcours conformes au Design System, encadrés par des vérifications déterministes.",
      links: [{ label: "Lire l'étude de cas MCP & Design System →", href: "/fr/work/exemple-design-system" }],
    },
    en: {
      reply:
        "Antoine specializes in AI-augmented Design Ops: he builds MCP servers and multi-agent workflows wired to reliable sources of truth (Figma, design tokens, domain rules, React / Vue 3).\n\nHis core rule is **Discovery first**—no blind UI generation. AI empowers PMs and engineers to ship Design System-compliant flows backed by deterministic checks.",
      links: [{ label: "Read the MCP & Design System case study →", href: "/en/work/exemple-design-system" }],
    },
  },
  {
    keywords: ["parcours", "experience", "expérience", "xp", "cv", "resume", "background", "career", "carriere", "carrière", "ans", "years"],
    fr: {
      reply:
        "Près de **10 ans d'expérience** sur des produits SaaS B2B complexes :\n• **2016–2023** : socle métier sur des produits de géolocalisation et gestion de flotte (Webdesigner → UX/UI → Product Designer).\n• **Depuis 2024** : scale-up SaaS logistique & last-mile, où il est passé **Lead Product Designer** en janvier 2026.",
      links: [
        { label: "Voir la page À propos →", href: "/fr/about" },
        { label: "Télécharger le CV (PDF) ↓", href: "/cv-fr.pdf" },
      ],
    },
    en: {
      reply:
        "Nearly **10 years of experience** on complex B2B SaaS products:\n• **2016–2023**: built his foundation on fleet-management and geolocation SaaS (Web Designer → UX/UI → Product Designer).\n• **2024–present**: logistics & last-mile SaaS scale-up, promoted to **Lead Product Designer** in January 2026.",
      links: [
        { label: "Read the About page →", href: "/en/about" },
        { label: "Download Resume (PDF) ↓", href: "/cv-en.pdf" },
      ],
    },
  },
  {
    keywords: ["lead", "management", "manager", "equipe", "équipe", "team", "leadership", "craft"],
    fr: {
      reply:
        "Antoine pratique un **leadership par le craft** plutôt que par le statut. Il encadre une équipe pluridisciplinaire (Product & Graphic Design) en privilégiant l'exemple, la qualité d'expérience, la vitesse d'exécution et la réduction des frictions avec les équipes tech — tout en outillant les non-designers pour qu'ils gagnent en autonomie.",
      links: [{ label: "En savoir plus sur son approche →", href: "/fr/about" }],
    },
    en: {
      reply:
        "Antoine practices **craft-led leadership** over top-down hierarchy. He leads a multidisciplinary Product & Graphic Design team by staying hands-on—focusing on experience quality, execution speed, smoother engineering collaboration, and equipping non-designers to ship autonomously.",
      links: [{ label: "More about his approach →", href: "/en/about" }],
    },
  },
  {
    keywords: ["code", "dev", "react", "vue", "tech", "prototype", "codebase", "stack", "figma", "design system", "token"],
    fr: {
      reply:
        "Profil hybride entre produit, design et code : il couvre toute la chaîne, de la Discovery amont avec le PM jusqu'au **prototypage direct dans la codebase** (environnements React et Vue 3).\n\nIl structure le pont entre Figma, les design tokens et le code pour éviter les pertes de traduction entre design et dev.",
      links: [{ label: "Étude de cas Design System & MCP →", href: "/fr/work/exemple-design-system" }],
    },
    en: {
      reply:
        "A hybrid profile bridging product, design, and code: he covers the full cycle from upstream Discovery with PMs to **prototyping directly in the codebase** (React and Vue 3 stacks).\n\nHe aligns Figma libraries, design tokens, and production code so nothing gets lost in handoff.",
      links: [{ label: "Design System & MCP case study →", href: "/en/work/exemple-design-system" }],
    },
  },
  {
    keywords: ["ux", "discovery", "recherche", "research", "erreur", "error", "psychologie", "reassurance", "réassurance", "projet", "case", "etude", "étude"],
    fr: {
      reply:
        "Sa méthode repose sur une culture **Discovery first** (données d'usage, personas, objectifs métier) et une forte sensibilité pédagogique : éviter l'effet « outil réservé aux initiés » et travailler la réassurance cognitive quand des erreurs techniques surviennent sur des flux sensibles.",
      links: [
        { label: "Étude de cas : Réassurance & gestion d'erreurs →", href: "/fr/work/exemple-reservation" },
        { label: "Étude de cas : Agent Design System & MCP →", href: "/fr/work/exemple-design-system" },
      ],
    },
    en: {
      reply:
        "His work is anchored in a **Discovery first** mindset (usage data, personas, business goals) and strong UX pedagogy: avoiding tools that feel built only for insiders, and designing cognitive reassurance when technical errors hit critical workflows.",
      links: [
        { label: "Case study: Cognitive reassurance & errors →", href: "/en/work/exemple-reservation" },
        { label: "Case study: Agent Design System & MCP →", href: "/en/work/exemple-design-system" },
      ],
    },
  },
  {
    keywords: ["remote", "lille", "localisation", "location", "dispo", "contact", "email", "mail", "linkedin", "langue", "anglais", "english"],
    fr: {
      reply:
        "Antoine est basé dans la **métropole lilloise** et privilégie le **full remote**. Il parle français (natif) et travaille au quotidien en anglais dans des environnements produit, tech et IA.\n\nPour échanger directement sur un produit, un design system ou une opportunité :",
      links: [
        { label: "Envoyer un email →", href: "mailto:contact@antoinedelporte.fr" },
        { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/antoinedelporte", external: true },
      ],
    },
    en: {
      reply:
        "Antoine is based near **Lille, France**, and targets **full-remote** roles. He is a native French speaker and works daily in English across product, engineering, and AI contexts.\n\nTo reach out about a product, system, or opportunity:",
      links: [
        { label: "Send an email →", href: "mailto:contact@antoinedelporte.fr" },
        { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/antoinedelporte", external: true },
      ],
    },
  },
  {
    keywords: ["salaire", "salary", "tjm", "prix", "remuneration", "rémunération", "compensation", "woop", "situaction", "employeur"],
    fr: {
      reply:
        "Je ne partage pas d'informations confidentielles ou personnelles ici. Le mieux est d'en discuter directement avec Antoine par email ou sur LinkedIn.",
      links: [{ label: "Contacter Antoine →", href: "mailto:contact@antoinedelporte.fr" }],
    },
    en: {
      reply:
        "I don't share confidential or personal details here. The best way is to discuss it directly with Antoine via email or LinkedIn.",
      links: [{ label: "Contact Antoine →", href: "mailto:contact@antoinedelporte.fr" }],
    },
  },
];

export function answerLocally(question: string, lang: Locale): LocalAnswer {
  const normalized = question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let bestTopic: Topic | null = null;
  let bestScore = 0;

  for (const topic of TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      const cleanKw = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(cleanKw)) score += cleanKw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic) {
    return bestTopic[lang];
  }

  if (lang === "en") {
    return {
      reply:
        "Antoine Delporte is a **Lead Product Designer** (~10 years of experience, based near Lille, full remote) focused on complex B2B products, Design Systems, and **AI-augmented Design Ops** (MCP servers, multi-agent workflows, prototyping in code).\n\nFeel free to ask about his AI/MCP setup, his craft-led leadership, his background, or browse the case studies right below.",
      links: [
        { label: "Explore the About page →", href: "/en/about" },
        { label: "Read the MCP case study →", href: "/en/work/exemple-design-system" },
      ],
    };
  }

  return {
    reply:
      "Antoine Delporte est **Lead Product Designer** (~10 ans d'expérience, basé à Lille, full remote), spécialisé sur les produits B2B complexes, les Design Systems et la **Design Ops augmentée par l'IA** (serveurs MCP, workflows multi-agents, prototypage dans le code).\n\nTu peux m'interroger sur son approche IA/MCP, son leadership par le craft, son parcours, ou parcourir ses études de cas juste en dessous.",
    links: [
      { label: "Voir la page À propos →", href: "/fr/about" },
      { label: "Lire l'étude de cas MCP →", href: "/fr/work/exemple-design-system" },
    ],
  };
}
