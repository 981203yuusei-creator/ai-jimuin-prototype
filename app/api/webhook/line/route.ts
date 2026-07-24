import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyToLine } from "../../../../lib/line";
import { extractJobInfo } from "../../../../lib/extractInfo";
import { getOpenJob, saveJob } from "../../../../lib/jobsRepo";
import { registerJobToCalendar } from "../../../../lib/calendar";

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

    const openJob = await getOpenJob(userId);
    const extracted = await extractJobInfo(userMessage, openJob ?? undefined);
    const isComplete = extracted.missingFields.length === 0;

    const calendarEventId = isComplete ? await registerJobToCalendar(extracted) : null;

    await saveJob(userId, openJob?.id ?? null, extracted, isComplete, calendarEventId);

    await replyToLine(event.replyToken, extracted.replyMessage);
  }

  return NextResponse.json({ ok: true });
}

