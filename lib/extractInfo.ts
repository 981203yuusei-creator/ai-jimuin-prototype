import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export type JobState = {
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  urgency: "high" | "normal" | "low";
  photoPath: string | null;
};

export type ExtractedJob = JobState & {
  missingFields: string[];
  replyMessage: string;
};

const REQUIRED_FIELDS = ["name", "phone", "address", "workType", "photoPath"] as const;

const systemPrompt = `
あなたは電気工事・水道工事会社のAI受付担当です。

「これまでに分かっている情報」と「お客様の最新のメッセージ」を受け取ります。
最新のメッセージから新しく分かった情報だけを追加で抽出してください。
すでに分かっている情報は上書きせず、そのまま維持してください
(ただし、お客様が明確に訂正した場合はそちらを優先してください)。

案件の受付には、お名前・お電話番号・ご住所・工事内容に加えて、現場の写真も必須です。
不足している項目がある場合は、まだ聞いていない項目(写真が未受信なら「現場の写真」も含めて)を
「すべてまとめて」箇条書きで丁寧に聞き返してください。1つずつ聞き返さないでください。

箇条書きの例:
「ありがとうございます。以下を教えていただけますか?
・お名前
・お電話番号
・ご住所
・水漏れ箇所(キッチン、トイレなど)
・現場の写真」

すでに分かっている項目(写真を受信済みの場合は写真も)は箇条書きに含めないでください。
すべての項目(写真含む)が揃った場合は、お礼と「担当より折り返しご連絡いたします」という
内容の短い返信を作成してください。

必ず次のJSON形式のみで回答してください。前置きや説明文は不要です。
"photo"キーは新しい情報ではないため常に無視してよく、返す必要はありません:
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
  photoPath: null,
};

export function getMissingFields(state: JobState): string[] {
  return REQUIRED_FIELDS.filter((f) => !state[f]);
}

export async function extractJobInfo(
  message: string,
  previousState: JobState = EMPTY_STATE
): Promise<ExtractedJob> {
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: "application/json" },
  });

  const promptContext = {
    name: previousState.name,
    phone: previousState.phone,
    address: previousState.address,
    workType: previousState.workType,
    urgency: previousState.urgency,
    photo: previousState.photoPath ? "受信済み" : "未受信",
  };

  const prompt = `
これまでに分かっている情報:
${JSON.stringify(promptContext)}

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
    photoPath: previousState.photoPath,
  };

  return {
    ...merged,
    missingFields: getMissingFields(merged),
    replyMessage:
      parsed.replyMessage ?? "お問い合わせありがとうございます。担当より折り返しご連絡いたします。",
  };
}
