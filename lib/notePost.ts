import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabase } from "./supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SYSTEM_PROMPT = `
あなたは「ジムアシ」というSaaSのSNS/note運用担当者です。
ジムアシは、工事・修理・点検・清掃など、現場に訪問して作業を行う小規模事業者向けに、
LINEでの顧客対応自動化・AIによる情報整理・スケジュール管理・見積書/請求書発行・確定申告サポートを
提供する事務アシスタントSaaSです(月額9,800円、30日間無料トライアルあり)。

noteに投稿する短めの宣伝記事を1本書いてください。ブログ記事のような網羅的な解説ではなく、
現場訪問型サービス業の個人事業主・小規模事業者が「あるある」と共感できる悩みや失敗エピソード、
豆知識、業界のちょっとした工夫などを軽いトーンで書き、最後にジムアシを1〜2文で自然に紹介してください。

必ず守ること:
- 誇張や断定的な統計・法律解釈は書かない
- 特定の競合サービス名は出さない
- 400〜700文字程度、3〜5段落
- 毎回切り口を変える(電話対応、見積書、写真管理、確定申告、リピート顧客、スケジュール管理、一人親方の悩み等からランダムに選ぶ)
- 押し売り感を出さない。最後の宣伝は軽く触れる程度

必ず次のJSON形式のみで回答してください。前置きや説明文は不要です:
{
  "title": "20〜30文字程度の見出し",
  "paragraphs": ["段落1", "段落2", "段落3"]
}
`.trim();

export async function generateNotePost(): Promise<{ title: string; paragraphs: string[] } | null> {
  const { data } = await getSupabase()
    .from("note_posts")
    .select("title")
    .order("created_at", { ascending: false })
    .limit(15);

  const recentTitles = (data ?? []).map((r: any) => r.title);

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
直近に投稿したタイトル(切り口が重複しないこと):
${recentTitles.length > 0 ? recentTitles.map((t: string) => `・${t}`).join("\n") : "(まだありません)"}
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text() ?? "{}";
    const parsed = JSON.parse(raw);

    if (!parsed.title || !Array.isArray(parsed.paragraphs)) {
      console.error("generateNotePost: invalid response shape", parsed);
      return null;
    }

    return { title: parsed.title, paragraphs: parsed.paragraphs };
  } catch (err) {
    console.error("generateNotePost failed:", err);
    return null;
  }
}

export async function recordNotePost(title: string, url: string | undefined): Promise<void> {
  const { error } = await getSupabase().from("note_posts").insert({ title, url });
  if (error) console.error("recordNotePost failed:", error);
}
