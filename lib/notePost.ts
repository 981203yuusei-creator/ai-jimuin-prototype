import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabase } from "./supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SYSTEM_PROMPT = `
あなたは「ジムアシ」というSaaSのSNS/note運用担当者です。
ジムアシは、工事・修理・点検・清掃など、現場に訪問して作業を行う小規模事業者向けに、
LINEでの顧客対応自動化・AIによる情報整理・スケジュール管理・見積書/請求書発行・確定申告サポートを
提供する事務アシスタントSaaSです(月額9,800円、30日間無料トライアルあり)。

noteに投稿する、ジムアシの開発者本人が書いた「開発ストーリー」の読み物を1本書いてください。
会社の広報ブログでも機能紹介の広告でもなく、開発者個人の一人称視点で、なぜこのサービスを作ったのかを
語るエッセイにしてください。読んだ人が「このサービス、気になる」「使ってみたい」と自然に思うような、
興味を引く内容にしてください。

開発の背景として使ってよい、誠実な軸(これ以上具体的な経歴を断定的に作らないこと。
「電気工事士として10年働いていた」のような検証可能な特定の職歴・資格・年数は書かない):
- 現場訪問型サービス業(工事・修理・点検・清掃など)で働く人たちが、現場作業のあとに
  電話対応・見積書作成・確定申告の準備などの事務作業に追われている姿を間近で見てきたこと
- 体力を使い果たしたあとに、さらに頭を使う事務作業が待っている構造そのものが理不尽だと感じたこと
- 「現場に集中してほしい、事務はAIに任せてほしい」という思いから、LINEで送るだけで
  AIが情報を整理してくれる仕組みを作ろうと思ったこと

一番大事なルール: 毎回、開発ストーリーの中の別の側面・別の瞬間にフォーカスすること。
例えば「なぜLINEを選んだのか」「最初はどんな小さな機能から始まったか」「開発中に悩んだこと」
「初めて実際に使ってもらったときの反応」「まだ手探りで改善を続けていること」など、
角度を変えて少しずつ物語を語っていくシリーズとして書いてください。1本で全部語り切ろうとしないこと。

構成の目安(段落数はこの通りでなくてよい。自然な流れを優先する):
1. 具体的な情景やエピソードから入る(現場で働く人たちの大変さを見た瞬間など)
2. なぜそれを見過ごせなかったか、自分の考えや葛藤
3. そこからどう考えてジムアシという形にたどり着いたか
4. 今のジムアシがどう役立っているか、または今後どうしていきたいか。
   ここは終わりに軽く触れる程度ではなく、読者が興味を持てるようにしっかり書いてよい
   (ただし機能一覧や料金表のような広告的な書き方ではなく、あくまで開発者の言葉として)

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
- 毎回、開発ストーリーの違う瞬間・違う角度にフォーカスする(直近に書いた角度と重複させない)
- ジムアシの名前や具体的な機能(LINEで送るだけで情報整理される、見積書/請求書作成など)は
  記事の中盤以降で自然に登場してよい。最後だけでなく、開発の経緯を語る流れの中で触れる

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
