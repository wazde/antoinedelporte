// Langues du site + tous les textes de l'interface (hors études de cas).
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const fr = {
  nav: { work: "Études de cas", about: "À propos" },
  home: {
    kicker: "Lead Product Designer · Lille · Full Remote",
    title: "Produits complexes, Design Systems & Design Ops",
    titleItalic: "augmentés par l'IA.",
    intro:
      "Près de 10 ans à concevoir des produits B2B exigeants — de la Product Discovery en binôme avec les PM jusqu'au prototypage direct dans la codebase et l'outillage d'agents IA encadrés par le Design System.",
    pillars: [
      {
        label: "01 · Discovery first",
        text: "Pas d'interface générée à l'aveugle : données d'usage, objectifs métier et garde-fous méthodologiques précèdent la production.",
      },
      {
        label: "02 · Design Systems & MCP",
        text: "Sources de vérité reliées au code (Figma, tokens, React/Vue) et serveurs MCP pour permettre aux équipes de livrer en autonomie.",
      },
      {
        label: "03 · Leadership par le craft",
        text: "Un management de pratique centré sur la qualité d'expérience, la vitesse d'exécution et la réduction des frictions avec la tech.",
      },
    ],
    selected: "Études de cas sélectionnées",
    readCase: "Lire l'étude de cas",
  },
  chat: {
    ariaLabel: "Discussion sur le profil d'Antoine Delporte",
    heading: "Posez une question sur",
    headingItalic: "Antoine Delporte.",
    subtitle:
      "Lead Product Designer spécialisé en Design Systems & Design Ops augmentée par l'IA. Explorez son parcours via cette discussion, ou parcourez ses études de cas juste en dessous.",
    placeholder: "Ex : Comment utilise-t-il l'IA et les serveurs MCP en design ?",
    send: "Envoyer",
    reset: "Nouvelle discussion",
    you: "Vous",
    assistant: "Assistant · Profil d'Antoine",
    modeLive: "Gemini · Live",
    modeLocal: "Base de profil",
    error: "Petit souci technique. Vous pouvez parcourir les études de cas ci-dessous ou écrire directement à Antoine.",
    scrollToWork: "Ou parcourir les études de cas",
    prompts: [
      "Comment travaille-t-il avec l'IA et les serveurs MCP ?",
      "Quel est son parcours et son rôle actuel ?",
      "Quelle est sa façon de manager une équipe design ?",
      "Est-ce qu'il code vraiment ?",
      "Est-il disponible en full remote ?",
    ],
  },
  about: {
    kicker: "À propos",
    title: "Un profil hybride entre vision produit, design et code.",
    lead:
      "Lead Product Designer basé dans la métropole lilloise, je conçois des produits numériques depuis près de 10 ans avec une obsession : rendre simples et fiables des outils métiers complexes.",
    body: [
      "J'ai bâti mon socle pendant près de 8 ans sur des produits SaaS de géolocalisation et de gestion de flotte, en évoluant du webdesign à l'UX/UI puis au Product Design, avant de rejoindre une scale-up SaaS spécialisée dans l'orchestration logistique et le last-mile où j'encadre aujourd'hui la pratique Product & Graphic Design.",
      "Ma conviction : l'IA n'a de valeur en design que si elle s'appuie sur une Discovery solide et un système structuré. Je conçois des workflows multi-agents et des serveurs MCP branchés sur nos sources de vérité (Figma, design tokens, règles métier) pour sécuriser la vélocité des équipes sans sacrifier la cohérence ni l'accessibilité.",
      "Au quotidien, je privilégie un leadership de terrain, sans posture hiérarchique descendante : outiller les PM et les développeurs, débloquer les sujets techniques directement dans le code, et garder du temps de cerveau pour les vrais problèmes utilisateurs.",
    ],
     trajectoriesTitle: "Repères",
    trajectories: [
      { period: "2026 — Présent", role: "Lead Product Designer", context: "Scale-up SaaS logistique & last-mile" },
      { period: "2024 — 2026", role: "Product Designer", context: "Scale-up SaaS logistique & last-mile" },
      { period: "2016 — 2023", role: "Webdesigner → UX/UI → Product Designer", context: "SaaS B2B géolocalisation & gestion de flotte" },
    ],
  },
  caseStudy: { back: "← Toutes les études de cas", role: "Rôle", year: "Période" },
  footer: { cv: "CV (PDF)", contact: "Discuter d'un produit, d'un système ou d'une opportunité", made: "Conçu et codé avec soin." },
  theme: { toLight: "Passer en mode clair", toDark: "Passer en mode sombre" },
  egg: "✦ Mode édition inversée activé (retape le code pour revenir)",
};

const en: typeof fr = {
  nav: { work: "Case studies", about: "About" },
  home: {
    kicker: "Lead Product Designer · Lille, France · Full Remote",
    title: "Complex products, Design Systems &",
    titleItalic: "AI-augmented Design Ops.",
    intro:
      "Nearly 10 years designing demanding B2B products—from upstream Product Discovery paired with PMs to prototyping straight in the codebase and building AI agent workflows governed by the Design System.",
    pillars: [
      {
        label: "01 · Discovery first",
        text: "No blind UI generation: usage data, business goals and methodological guardrails always come before production speed.",
      },
      {
        label: "02 · Design Systems & MCP",
        text: "Single sources of truth wired into code (Figma, tokens, React/Vue) and MCP servers empowering teams to ship autonomously.",
      },
      {
        label: "03 · Craft-led leadership",
        text: "Hands-on leadership focused on experience quality, execution speed, and removing friction with engineering teams.",
      },
    ],
    selected: "Selected case studies",
    readCase: "Read case study",
  },
  chat: {
    ariaLabel: "Chat about Antoine Delporte's profile",
    heading: "Ask anything about",
    headingItalic: "Antoine Delporte.",
    subtitle:
      "Lead Product Designer focused on Design Systems & AI-augmented Design Ops. Explore his background through this chat, or scroll down to read the case studies.",
    placeholder: "e.g. How does he use AI and MCP servers in Design Ops?",
    send: "Send",
    reset: "New chat",
    you: "You",
    assistant: "Assistant · Antoine's profile",
    modeLive: "Gemini · Live",
    modeLocal: "Profile guide",
    error: "Something went wrong. Feel free to browse the case studies below or email Antoine directly.",
    scrollToWork: "Or jump straight to case studies",
    prompts: [
      "How does he use AI and MCP servers?",
      "What's his background and current role?",
      "What is his leadership style?",
      "Does he actually prototype in code?",
      "Is he open to full-remote roles?",
    ],
  },
  about: {
    kicker: "About",
    title: "A hybrid profile bridging product vision, design, and code.",
    lead:
      "Lead Product Designer based near Lille, France. For nearly 10 years I've been designing digital products with one focus: making complex business tools feel clear, reliable, and reassuring.",
    body: [
      "I built my foundation over 8 years on B2B fleet-management and geolocation SaaS products—growing from Web Designer to UX/UI and Product Designer—before joining a logistics & last-mile orchestration SaaS scale-up where I now lead the Product & Graphic Design practice.",
      "My core belief: AI only brings real value to design when grounded in rigorous Discovery and a structured system. I build multi-agent workflows and MCP servers connected to our sources of truth (Figma, design tokens, domain rules) so product teams can move faster without trading away consistency or UX quality.",
      "Day to day, I favor practice-led leadership over top-down management: equipping PMs and engineers to ship compliant flows autonomously, prototyping directly in the repository, and protecting design bandwidth for deep user problems.",
    ],
    trajectoriesTitle: "Timeline",
    trajectories: [
      { period: "2026 — Present", role: "Lead Product Designer", context: "Logistics & last-mile SaaS scale-up" },
      { period: "2024 — 2026", role: "Product Designer", context: "Logistics & last-mile SaaS scale-up" },
      { period: "2016 — 2023", role: "Web Designer → UX/UI → Product Designer", context: "B2B geolocation & fleet management SaaS" },
    ],
  },
  caseStudy: { back: "← All case studies", role: "Role", year: "Timeline" },
  footer: { cv: "Resume (PDF)", contact: "Let's talk about product, systems, or opportunities", made: "Designed and coded with care." },
  theme: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  egg: "✦ Inverted edition mode enabled (type the code again to reset)",
};

export const dictionaries = { fr, en };
export type Dictionary = typeof fr;
