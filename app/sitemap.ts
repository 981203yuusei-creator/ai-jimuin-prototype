import type { MetadataRoute } from "next";

const SITE_URL = "https://ai-jimuin-prototype-shimo1.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/signup", "/legal/terms", "/legal/privacy", "/legal/tokushoho", "/guide/line-setup"];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
