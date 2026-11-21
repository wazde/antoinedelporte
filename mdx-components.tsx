import type { MDXComponents } from "mdx/types";

// Obligatoire pour @next/mdx. On peut y remplacer les balises Markdown
// (h2, img, a…) par nos propres composants stylés plus tard.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
