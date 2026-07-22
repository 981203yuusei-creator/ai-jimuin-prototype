import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyToLine } from "../../../../lib/line";
import { extractJobInfo } from "../../../../lib/extractInfo";

const jobDraftsByUser = new Map<string, Record<string, unknown>>();

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  if (!verifyLineSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);

  for (const event of body.events ?? []) {
    if (event.type !== "message" || event.message.type !== "text") continue;

    const userId = event.source.userId;
    const userMessage = event.message.text;

    const previous = jobDraftsByUser.get(userId) ?? {};
    const combinedText = [previous.summary, userMessage].filter(Boolean).join("\n");

    const extracted = await extractJobInfo(combinedText);
    jobDraftsByUser.set(userId, extracted);

    if (extracted.missingFields.length === 0) {
      console.log("案件登録可能:", extracted);
    }

    await replyToLine(event.replyToken, extracted.replyMessage);
  }

  return NextResponse.json({ ok: true });
}
