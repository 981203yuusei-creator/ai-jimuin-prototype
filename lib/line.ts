import crypto from "crypto";

export function verifyLineSignature(
  body: string,
  signature: string | null,
  channelSecret: string
): boolean {
  if (!signature) return false;
  const hash = crypto.createHmac("sha256", channelSecret).update(body).digest("base64");
  return hash === signature;
}

export async function replyToLine(replyToken: string, text: string, accessToken: string) {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
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

export async function getLineImageContent(
  messageId: string,
  accessToken: string
): Promise<{ data: Buffer; contentType: string } | null> {
  const res = await fetch(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    console.error("getLineImageContent failed:", await res.text());
    return null;
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const data = Buffer.from(await res.arrayBuffer());
  return { data, contentType };
}
