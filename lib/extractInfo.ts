import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export type JobState = {
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  urgency: "high" | "normal" | "low";
};

export type ExtractedJob = JobState & {
  missingFields: string[];
  replyMessage: string;
};

const REQUIRED_FIELDS = ["name", "phone", "address", "workType"] as const;

const systemPrompt = `
あなたは電気工事・水道工事会社のAI受付担当です。

「これまでに分かっている情報」と「お客様の最新のメッセージ」を受け取ります。
最新のメッセージから新しく分かった情報だけを追加で抽出してください。
すでに分かっている情報は上書きせず、そのまま維持してください
(ただし、お客様が明確に訂正した場合はそちらを優先してください)。

不足している項目がある場合は、まだ聞いていない項目を「すべてまとめて」
箇条書きで丁寧に聞き返してください。1つずつ聞き返さないでください。

箇条書きの例:
「ありがとうございます。以下を教えていただけますか?
・お名前
・お電話番号
・ご住所
・水漏れ箇所(キッチン、トイレなど)」

すでに分かっている項目は箇条書きに含めないでください。
すべての項目が揃った場合は、お礼と「担当より折り返しご連絡いたします」という
内容の短い返信を作成してください。

必ず次のJSON形式のみで回答してください。前置きや説明文は不要です:
{
  "name": string | null,
  "phone": string | null,
  "address": string | null,
  "workType": string | null,
  "urgency": "high" | "normal" | "low",
  "replyMessage": string
}
`.trim();

const EMPTY_STATE: JobState = {
  name: null,
  phone: null,
  address: null,
  workType: null,
  urgency: "normal",
};

export async function extractJobInfo(
  message: string,
  previousState: JobState = EMPTY_STATE
): Promise<ExtractedJob> {
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
これまでに分かっている情報:
${JSON.stringify(previousState)}

お客様の最新のメッセージ:
${message}
`.trim();

  const result = await model.generateContent(prompt);
  const raw = result.response.text() ?? "{}";
  const parsed = JSON.parse(raw);

  const merged: JobState = {
    name: parsed.name ?? previousState.name,
    phone: parsed.phone ?? previousState.phone,
    address: parsed.address ?? previousState.address,
    workType: parsed.workType ?? previousState.workType,
    urgency: parsed.urgency ?? previousState.urgency,
  };

  const missingFields = REQUIRED_FIELDS.filter((f) => !merged[f]);

  return {
    ...merged,
    missingFields,
    replyMessage:
      parsed.replyMessage ?? "お問い合わせありがとうございます。担当より折り返しご連絡いたします。",
  };
}
