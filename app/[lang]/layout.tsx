import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { dictionaries, isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EasterEgg from "@/components/EasterEgg";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Génère /fr et /en au moment du build
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = dictionaries[isLocale(lang) ? lang : "fr"];
  return {
    title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.name}` },
    description: t.home.intro,
  };
}

// Petit script exécuté AVANT l'affichage pour appliquer le bon thème sans "flash"
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang];

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      style={{
        ["--font-sans" as string]: GeistSans.style.fontFamily,
        ["--font-serif" as string]: fraunces.style.fontFamily,
      }}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header lang={lang} t={t} />
        <main>{children}</main>
        <Footer lang={lang} t={t} />
        <EasterEgg message={t.egg} />
      </body>
    </html>
  );
}
