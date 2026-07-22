import crypto from "crypto";

export function verifyLineSignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.LINE_CHANNEL_SECRET ?? "";
  const hash = crypto.createHmac("sha256", secret).update(body).digest("base64");
  return hash === signature;
}

export async function replyToLine(replyToken: string, text: string) {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("LINE reply failed:", err);
  }
}
