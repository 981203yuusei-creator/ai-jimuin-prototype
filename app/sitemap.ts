import type { MetadataRoute } from "next";
import { listBlogPosts } from "../lib/blog";

export const dynamic = "force-dynamic";

const SITE_URL = "https://ai-jimuin-prototype-shimo1.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/signup",
    "/legal/terms",
    "/legal/privacy",
    "/legal/tokushoho",
    "/guide/line-setup",
    "/blog",
    "/blog/denkikoji-jimu-rakuni",
    "/blog/suidokoji-jimu-kouritsuka",
    "/blog/denwa-taiou-genba",
    "/blog/line-koukyaku-kanri",
    "/blog/hitorioyakata-jimu-kouritsuka",
    "/blog/mitsumorisho-seikyusho-invoice",
    "/blog/kakuteishinkoku-junbi",
    "/blog/yoyaku-schedule-kanri",
    "/blog/genba-shashin-kanri",
    "/blog/mitsumori-kakaku-settei",
    "/blog/after-follow-repeat",
    "/blog/sagyoin-jouhou-kyoyu",
  ];

  const dbPosts = await listBlogPosts();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  for (const post of dbPosts) {
    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.createdAt),
    });
  }

  return entries;
}
