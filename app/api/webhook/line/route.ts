import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyToLine, getLineImageContent } from "../../../../lib/line";
import { extractJobInfo, getMissingFields, JobState } from "../../../../lib/extractInfo";
import { getOpenJob, saveJob } from "../../../../lib/jobsRepo";
import { registerJobToCalendar } from "../../../../lib/calendar";
import { getCompanyByLineDestination, Company } from "../../../../lib/companies";
import { uploadJobPhoto } from "../../../../lib/storage";

const FIELD_LABELS: Record<string, string> = {
  name: "お名前",
  phone: "お電話番号",
  address: "ご住所",
  workType: "工事内容",
  photoPath: "現場の写真",
};

function buildMissingFieldsReply(missingFields: string[]): string {
  const bullets = missingFields.map((f) => `・${FIELD_LABELS[f] ?? f}`).join("\n");
  return `写真を受け取りました。あわせて以下も教えていただけますか?\n${bullets}`;
}

async function finalizeJob(
  company: Company,
  userId: string,
  jobId: string | null,
  state: JobState,
  replyToken: string,
  replyText: string
) {
  const missingFields = getMissingFields(state);
  const isComplete = missingFields.length === 0;
  const calendarEventId = isComplete
    ? await registerJobToCalendar(state, company.calendarId)
    : null;

  await saveJob(company.id, userId, jobId, state, isComplete, calendarEventId);
  await replyToLine(replyToken, replyText, company.lineChannelAccessToken);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const company = await getCompanyByLineDestination(body.destination ?? "");
  if (!company) {
    return NextResponse.json({ error: "unknown channel" }, { status: 404 });
  }

  if (!verifyLineSignature(rawBody, signature, company.lineChannelSecret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  for (const event of body.events ?? []) {
    if (event.type !== "message") continue;

    const userId = event.source.userId;

    if (event.message.type === "text") {
      const openJob = await getOpenJob(company.id, userId);
      const extracted = await extractJobInfo(event.message.text, openJob ?? undefined);
      await finalizeJob(
        company,
        userId,
        openJob?.id ?? null,
        extracted,
        event.replyToken,
        extracted.replyMessage
      );
      continue;
    }

    if (event.message.type === "image") {
      const content = await getLineImageContent(event.message.id, company.lineChannelAccessToken);
      if (!content) continue;

      const photoPath = await uploadJobPhoto(
        company.id,
        userId,
        event.message.id,
        content.data,
        content.contentType
      );

      const openJob = await getOpenJob(company.id, userId);
      const state: JobState = {
        name: openJob?.name ?? null,
        phone: openJob?.phone ?? null,
        address: openJob?.address ?? null,
        workType: openJob?.workType ?? null,
        urgency: openJob?.urgency ?? "normal",
        photoPath: photoPath ?? openJob?.photoPath ?? null,
      };

      const missingFields = getMissingFields(state);
      const replyText =
        missingFields.length === 0
          ? "写真を受け取りました。ありがとうございます。担当より折り返しご連絡いたします。"
          : buildMissingFieldsReply(missingFields);

      await finalizeJob(company, userId, openJob?.id ?? null, state, event.replyToken, replyText);
    }
  }

  return NextResponse.json({ ok: true });
}
