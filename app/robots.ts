import type { MetadataRoute } from "next";

const SITE_URL = "https://ai-jimuin-prototype-shimo1.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/report/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
