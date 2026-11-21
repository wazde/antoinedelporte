// Langues du site + tous les textes de l'interface (hors études de cas).
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const fr = {
  nav: { work: "Projets", about: "À propos" },
  home: {
    hello: "Salut, moi c'est",
    title: "Product Designer.",
    intro:
      "Je conçois des produits numériques clairs, utiles et (un peu) joyeux. Ici, tu trouveras mes études de cas et quelques expérimentations.",
    selected: "Projets sélectionnés",
    readCase: "Lire l'étude de cas",
  },
  about: {
    title: "À propos",
    body: [
      "Écris ici quelques lignes sur toi : ton parcours, ta façon de travailler, ce qui te fait vibrer dans le design produit.",
      "Tu peux aussi parler de ce que tu fais en dehors du travail : ça rend un portfolio bien plus mémorable.",
    ],
  },
  caseStudy: { back: "← Tous les projets", role: "Rôle", year: "Année" },
  footer: { cv: "Télécharger mon CV", contact: "Envie d'échanger ?", made: "Codé avec soin." },
  theme: { toLight: "Passer en mode clair", toDark: "Passer en mode sombre" },
  egg: "🎉 Mode fête activé ! (retape le code pour l'arrêter)",
};

const en: typeof fr = {
  nav: { work: "Work", about: "About" },
  home: {
    hello: "Hi, I'm",
    title: "Product Designer.",
    intro:
      "I design clear, useful and (slightly) joyful digital products. Here you'll find my case studies and a few experiments.",
    selected: "Selected work",
    readCase: "Read the case study",
  },
  about: {
    title: "About",
    body: [
      "Write a few lines about yourself here: your background, how you work, what excites you about product design.",
      "You can also talk about what you do outside of work, it makes a portfolio far more memorable.",
    ],
  },
  caseStudy: { back: "← All projects", role: "Role", year: "Year" },
  footer: { cv: "Download my resume", contact: "Want to chat?", made: "Crafted with care." },
  theme: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  egg: "🎉 Party mode on! (type the code again to stop it)",
};

export const dictionaries = { fr, en };
export type Dictionary = typeof fr;
