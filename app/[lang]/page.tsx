import { dictionaries, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";
import AdaptivePortfolio from "@/components/AdaptivePortfolio";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const t = dictionaries[lang];
  const projects = (await getProjects(lang)).map(({ slug, meta }) => ({ slug, meta }));

  return <AdaptivePortfolio lang={lang} t={t} projects={projects} />;
}
