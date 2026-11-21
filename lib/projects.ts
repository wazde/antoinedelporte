import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import type { Locale } from "./i18n";

// Les infos exportées en haut de chaque fichier .mdx (`export const metadata = {...}`)
export type ProjectMeta = {
  title: string;
  summary: string;
  role: string;
  year: string;
  tags: string[];
  order: number; // ordre d'affichage sur l'accueil
  color?: string; // couleur de la carte sur l'accueil
};

const DIR = path.join(process.cwd(), "content", "case-studies");

// Une étude de cas = deux fichiers : mon-projet.fr.mdx et mon-projet.en.mdx
export function getProjectSlugs(): string[] {
  return fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".fr.mdx"))
    .map((file) => file.replace(".fr.mdx", ""));
}

export async function getProject(slug: string, lang: Locale) {
  const mod = (await import(`@/content/case-studies/${slug}.${lang}.mdx`)) as unknown as {
    default: ComponentType;
    metadata: ProjectMeta;
  };
  return { slug, Content: mod.default, meta: mod.metadata };
}

export async function getProjects(lang: Locale) {
  const projects = await Promise.all(getProjectSlugs().map((slug) => getProject(slug, lang)));
  return projects.sort((a, b) => a.meta.order - b.meta.order);
}
