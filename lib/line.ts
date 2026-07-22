import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyToLine } from "../../../../lib/line";
import { extractJobInfo, JobState } from "../../../../lib/extractInfo";

const jobStateByUser = new Map<string, JobState>();

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

    const previousState = jobStateByUser.get(userId);
    const extracted = await extractJobInfo(userMessage, previousState);

    jobStateByUser.set(userId, {
      name: extracted.name,
      phone: extracted.phone,
      address: extracted.address,
      workType: extracted.workType,
      urgency: extracted.urgency,
    });

    if (extracted.missingFields.length === 0) {
      console.log("案件登録可能:", extracted);
    }

    await replyToLine(event.replyToken, extracted.replyMessage);
  }

  return NextResponse.json({ ok: true });
}
