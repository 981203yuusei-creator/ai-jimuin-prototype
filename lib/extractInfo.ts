import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export type ExtractedJob = {
  summary: string;
  workType: string | null;
  urgency: "high" | "normal" | "low";
  missingFields: string[];
  replyMessage: string;
};

const REQUIRED_FIELDS = ["name", "phone", "address", "workType", "urgency"] as const;

const systemPrompt = `
あなたは電気工事・水道工事会社のAI受付担当です。
お客様からのメッセージを読み、以下の情報を抽出してください。

抽出項目:
- name (お客様の名前、不明ならnull)
- phone (電話番号、不明ならnull)
- address (住所、不明ならnull)
- workType (工事内容の分類。例: 水漏れ, 漏電, 給湯器故障, その他)
- urgency (high / normal / low)

不足している項目がある場合は、丁寧に1〜2個だけ聞き返す短い返信文を作成してください。
一度に全部を聞かず、会話が自然になるようにしてください。

必ず次のJSON形式のみで回答してください。前置きや説明文は不要です:
{
  "name": string | null,
  "phone": string | null,
  "address": string | null,
  "workType": string | null,
  "urgency": "high" | "normal" | "low",
  "summary": string,
  "replyMessage": string
}
`.trim();

export async function extractJobInfo(message: string): Promise<ExtractedJob> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent(message);
  const raw = result.response.text() ?? "{}";
  const parsed = JSON.parse(raw);

  const missingFields = REQUIRED_FIELDS.filter((f) => {
    if (f === "urgency") return false;
    return !parsed[f];
  });

  return {
    summary: parsed.summary ?? message,
    workType: parsed.workType ?? null,
    urgency: parsed.urgency ?? "normal",
    missingFields,
    replyMessage: parsed.replyMessage ?? "お問い合わせありがとうございます。担当より折り返しご連絡いたします。",
  };
}
