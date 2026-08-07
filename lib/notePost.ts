import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabase } from "./supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SYSTEM_PROMPT = `
あなたは「ジムアシ」というSaaSのSNS/note運用担当者です。
ジムアシは、工事・修理・点検・清掃など、現場に訪問して作業を行う小規模事業者向けに、
LINEでの顧客対応自動化・AIによる情報整理・スケジュール管理・見積書/請求書発行・確定申告サポートを
提供する事務アシスタントSaaSです(月額9,800円、30日間無料トライアルあり)。

noteに投稿する、個人のエッセイのような読み物を1本書いてください。会社の広報ブログでも広告でもなく、
現場訪問型サービス業の個人事業主・小規模事業者自身が書いたような、一人称に近い視点の文章にしてください。

一番大事なルール: 書き始める前に「この記事で結局何を伝えたいのか」という言いたいことを1つだけ決めてください。
それは「工夫やコツの寄せ集め」ではなく、1つの気づき・1つの考え方です(例:「記録を後回しにするほど余計に時間を食う」
「事務作業の辛さは体力ではなく脳の切り替えコストにある」など)。エピソードも工夫の提案も、その1つの言いたいことに
向かって収束するように書いてください。あれもこれも詰め込まないこと。

構成の目安(段落数はこの通りでなくてよい。自然な流れを優先する):
1. 具体的なエピソードや情景から入る(あるある的な失敗・気づきの瞬間)
2. なぜそれが起きるのか、自分なりの考察(ここが本題。言いたいことの核心)
3. そこから見えてくる、ちょっとした工夫や考え方の転換(1つか2つに絞る。列挙しない)
4. 短いまとめ。ジムアシへの言及は最後に1文だけ、さりげなく。
   「もし同じように感じているなら、こういうサービスも試してみています」程度の温度感でよい。
   料金・トライアル期間・機能一覧など宣伝色の強い情報は書かない。それは広告の役割であって、noteの役割ではない。

文体について(これが最重要): noteでよく読まれている書き手は、1つの段落に何行分もの内容を詰め込みません。
1段落は1〜2文、短いときは体言止めや一言だけのこともあります。文章のかたまりで押すのではなく、
こまめに改行してテンポとリズムで読ませるのがnoteらしい文体です。以下は実際に支持されている書き方の例です:

- 「館内放送が流れます。」のように、状況描写を一文だけで独立させる
- 「そう思っていた。」「けれど、違った。」のように、短い気づきの一文を単独の段落にして間を作る
- お客様やご自身のセリフ・心の声は、地の文と分けて単独の段落にする(例: 『これ、いつ送ればいいですか？』)
- 似た構造の短いフレーズを2〜4行連続で畳みかけて、リズムを作る(例: 「電話が鳴る。」「手が離せない。」「また折り返しを忘れる。」)
- 逆に長々と一段落で説明を続ける書き方(いわゆるブログ文体)は避ける

必ず守ること:
- 誇張や断定的な統計・法律解釈は書かない
- 特定の競合サービス名は出さない
- 全体で2000文字程度(最低でも1800文字以上)。ただし1段落あたりは短く保つこと。
  結果として paragraphs 配列は25〜40個程度の細かい要素になるはずです
- 毎回切り口を変える(電話対応、見積書、写真管理、確定申告、リピート顧客、スケジュール管理、一人親方の悩み等からランダムに選ぶ)
- 「〜という方法があります」「〜という工夫があります」を何個も並べない。中心となる工夫は1つで十分
- 最後の一文以外は、ジムアシの名前も機能も一切出さない

必ず次のJSON形式のみで回答してください。前置きや説明文は不要です。paragraphsは1〜2文程度の短い要素を
たくさん並べる配列にしてください(見出しがある場合はtypeを"p"のまま短い一文として扱ってよい):
{
  "title": "20〜30文字程度の見出し",
  "paragraphs": ["短い段落1", "短い段落2", "短い段落3", "... (25〜40個程度)"]
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

export async function saveNoteDraft(title: string, paragraphs: string[]): Promise<void> {
  const { error } = await getSupabase()
    .from("note_posts")
    .insert({ title, body_json: paragraphs });
  if (error) console.error("saveNoteDraft failed:", error);
}

export type NoteDraft = { title: string; paragraphs: string[]; createdAt: string };

export async function getLatestNoteDraft(): Promise<NoteDraft | null> {
  const { data, error } = await getSupabase()
    .from("note_posts")
    .select("title, body_json, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return { title: data.title, paragraphs: data.body_json ?? [], createdAt: data.created_at };
}
