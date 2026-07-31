import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "../../../lib/blog";
import ArticleBlocks from "../ArticleBlocks";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>{post.title}</h1>

      <ArticleBlocks blocks={post.blocks} />

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」は、LINEとAIで現場訪問サービス業の事務作業をまるごとサポートする事務アシスタントです。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
