import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autorise les fichiers .mdx (études de cas) en plus du TypeScript
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // "/" redirige vers la version française
  async redirects() {
    return [{ source: "/", destination: "/fr", permanent: false }];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
