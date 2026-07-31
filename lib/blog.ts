import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabase } from "./supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  blocks: ArticleBlock[];
  createdAt: string;
};

function mapRow(data: any): BlogPost {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    blocks: data.body_json,
    createdAt: data.created_at,
  };
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listBlogPosts failed:", error);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getBlogPostBySlug failed:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}

async function createBlogPost(post: {
  slug: string;
  title: string;
  description: string;
  blocks: ArticleBlock[];
}): Promise<boolean> {
  const { error } = await getSupabase().from("blog_posts").insert({
    slug: post.slug,
    title: post.title,
    description: post.description,
    body_json: post.blocks,
  });

  if (error) {
    console.error("createBlogPost failed:", error);
    return false;
  }
  return true;
}

// トップページ・お役立ちコラム一覧に手動で掲載している既存記事タイトル(重複防止のためAIに伝える用)
const EXISTING_STATIC_TITLES = [
  "電気工事店の事務作業を楽にする方法",
  "水道工事店が事務作業を効率化する方法",
  "現場作業中に電話が鳴っても対応できない問題を解決する方法",
  "LINEで顧客管理をする方法とメリット・デメリット",
  "事務員を雇わずに一人親方が事務作業を効率化する方法",
  "個人事業主のための見積書・請求書の作り方とインボイス制度の対応",
  "職人・現場仕事のための確定申告の準備と経費管理",
  "予約・スケジュール管理をひとつにまとめる方法",
  "現場写真の管理でお客様とのトラブルを防ぐ方法",
  "小規模事業者の見積もり・価格設定の基本",
  "リピート顧客を増やすアフターフォローの工夫",
  "現場作業員との情報共有をスムーズにする方法",
];

const SYSTEM_PROMPT = `
あなたは「ジムアシ」というSaaSのオウンドメディア担当者です。
ジムアシは、工事・修理・点検・清掃など、現場に訪問して作業を行う小規模事業者向けに、
LINEでの顧客対応自動化・AIによる情報整理・スケジュール管理・見積書/請求書発行・確定申告サポートを
提供する事務アシスタントSaaSです(月額9,800円、30日間無料トライアルあり)。

現場訪問型サービス業の個人事業主・小規模事業者が抱える「事務作業の悩み」をテーマに、
検索で見つけてもらいやすく、かつ実際に役立つブログ記事を1本書いてください。

必ず守ること:
- 誇張や断定的な統計・法律解釈は書かない(一般的な工夫・考え方の紹介にとどめる)
- 特定の競合サービス名は出さない
- 読者に実際に役立つ具体的な工夫を、悩み→原因→対処の流れで書く
- 最後に「ジムアシ」がその悩みにどう役立つかを1〜2文で軽く触れる(売り込みすぎない)
- 以下の既存記事とテーマが重複しないようにする:
${EXISTING_STATIC_TITLES.map((t) => `・${t}`).join("\n")}

必ず次のJSON形式のみで回答してください。前置きや説明文は不要です:
{
  "slug": "英数字とハイフンのみの短いスラッグ(ローマ字)",
  "title": "記事タイトル(30文字程度)",
  "description": "記事の要約(60〜80文字程度)",
  "blocks": [
    { "type": "p", "text": "導入文" },
    { "type": "h2", "text": "見出し" },
    { "type": "p", "text": "本文" },
    { "type": "ul", "items": ["箇条書き1", "箇条書き2"] }
  ]
}
本文全体で6〜10ブロック程度、文字数は800〜1200字程度を目安にしてください。
`.trim();

export async function generateBlogPost(): Promise<{
  slug: string;
  title: string;
  description: string;
  blocks: ArticleBlock[];
} | null> {
  const existingPosts = await listBlogPosts();
  const existingTitles = existingPosts.map((p) => p.title);

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
これまでに自動生成した記事タイトル(これらとも重複しないこと):
${existingTitles.length > 0 ? existingTitles.map((t) => `・${t}`).join("\n") : "(まだありません)"}
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text() ?? "{}";
    const parsed = JSON.parse(raw);

    if (!parsed.slug || !parsed.title || !parsed.description || !Array.isArray(parsed.blocks)) {
      console.error("generateBlogPost: invalid response shape", parsed);
      return null;
    }

    return {
      slug: String(parsed.slug).toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      title: parsed.title,
      description: parsed.description,
      blocks: parsed.blocks,
    };
  } catch (err) {
    console.error("generateBlogPost failed:", err);
    return null;
  }
}

// 手動執筆記事(app/blog/<slug>/page.tsx)のスラッグ。DB記事のスラッグ衝突を避けるために使う。
const STATIC_SLUGS = [
  "denkikoji-jimu-rakuni",
  "suidokoji-jimu-kouritsuka",
  "denwa-taiou-genba",
  "line-koukyaku-kanri",
  "hitorioyakata-jimu-kouritsuka",
  "mitsumorisho-seikyusho-invoice",
  "kakuteishinkoku-junbi",
  "yoyaku-schedule-kanri",
  "genba-shashin-kanri",
  "mitsumori-kakaku-settei",
  "after-follow-repeat",
  "sagyoin-jouhou-kyoyu",
];

export async function generateAndSaveBlogPost(): Promise<boolean> {
  const generated = await generateBlogPost();
  if (!generated) return false;

  const existing = await getBlogPostBySlug(generated.slug);
  const collides = existing || STATIC_SLUGS.includes(generated.slug);
  const slug = collides ? `${generated.slug}-${Date.now().toString(36)}` : generated.slug;

  return createBlogPost({ ...generated, slug });
}
