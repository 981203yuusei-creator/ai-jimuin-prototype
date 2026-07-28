import type { MetadataRoute } from "next";

const SITE_URL = "https://ai-jimuin-prototype-shimo1.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/signup",
    "/legal/terms",
    "/legal/privacy",
    "/legal/tokushoho",
    "/guide/line-setup",
    "/blog",
    "/blog/denwa-taiou-genba",
    "/blog/line-koukyaku-kanri",
    "/blog/hitorioyakata-jimu-kouritsuka",
    "/blog/mitsumorisho-seikyusho-invoice",
    "/blog/kakuteishinkoku-junbi",
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
