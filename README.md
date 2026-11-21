# Portfolio

Site portfolio bilingue (FR/EN) — Next.js + MDX, hébergé sur Vercel.

## Lancer le site en local

```bash
npm install
npm run dev
```

Puis ouvre http://localhost:3000

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Mon nom, email, réseaux, CV | `lib/site.ts` |
| Les textes de l'interface (FR/EN) | `lib/i18n.ts` |
| Les couleurs (clair/sombre) | `app/globals.css` (variables en haut) |
| Une étude de cas | `content/case-studies/<projet>.fr.mdx` et `.en.mdx` |
| Mon CV | déposer `cv-fr.pdf` et `cv-en.pdf` dans `public/` |

## Ajouter une étude de cas

Copie `exemple-reservation.fr.mdx` et `.en.mdx`, renomme-les (le nom devient l'URL : `/fr/work/<nom>`),
modifie le bloc `metadata` en haut, puis écris en Markdown. Les images vont dans `public/` et
s'insèrent avec `![description](/mon-image.png)`.

## Easter egg

Konami code : ↑ ↑ ↓ ↓ ← → ← → B A 🎉
