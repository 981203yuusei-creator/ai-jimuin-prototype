import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyToLine, getLineImageContent } from "../../../../lib/line";
import { extractJobInfo, getMissingFields, JobState } from "../../../../lib/extractInfo";
import { getOpenJob, saveJob } from "../../../../lib/jobsRepo";
import { registerJobToCalendar } from "../../../../lib/calendar";
import {
  getCompanyByLineDestination,
  confirmOwnerRegistration,
  isSubscriptionUsable,
  Company,
} from "../../../../lib/companies";
import { uploadJobPhoto } from "../../../../lib/storage";
import { notifyOwner } from "../../../../lib/notify";

const FIELD_LABELS: Record<string, string> = {
  name: "お名前",
  phone: "お電話番号",
  address: "ご住所",
  workType: "作業内容",
  photoPath: "現場の写真",
};

const FALLBACK_REPLY =
  "申し訳ございません、只今システムが混み合っております。少し時間をおいて再度メッセージをお送りいただくか、お電話にてご連絡ください。";

function buildMissingFieldsReply(missingFields: string[]): string {
  const bullets = missingFields.map((f) => `・${FIELD_LABELS[f] ?? f}`).join("\n");
  return `写真を受け取りました。あわせて以下も教えていただけますか?\n${bullets}`;
}

function buildNewJobNotification(state: JobState, dashboardUrl: string): string {
  return [
    "【新規案件】",
    `作業内容: ${state.workType ?? "未確認"}`,
    `お名前: ${state.name ?? "未確認"}`,
    `電話番号: ${state.phone ?? "未確認"}`,
    `住所: ${state.address ?? "未確認"}`,
    "",
    `ダッシュボード: ${dashboardUrl}/dashboard`,
  ].join("\n");
}

async function finalizeJob(
  company: Company,
  userId: string,
  jobId: string | null,
  state: JobState,
  replyToken: string,
  replyText: string,
  dashboardUrl: string
) {
  const missingFields = getMissingFields(state);
  const isComplete = missingFields.length === 0;

  // 先にDBへ保存してから返信する(直後に次のメッセージが来ても最新状態を参照できるように)。
  const savedJobId = await saveJob(company.id, userId, jobId, state, isComplete, null);

  // お客様への返信を最優先で送る。Googleカレンダー登録は認証込みで時間がかかるため、
  // 返信の後に回しても体感速度には影響しない。
  await replyToLine(replyToken, replyText, company.lineChannelAccessToken);

  if (isComplete && savedJobId) {
    const calendarEventId = await registerJobToCalendar(state, company.calendarId);
    if (calendarEventId) {
      await saveJob(company.id, userId, savedJobId, state, true, calendarEventId);
    }
    await notifyOwner(company, buildNewJobNotification(state, dashboardUrl));
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");
  const dashboardUrl = new URL(req.url).origin;

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const company = await getCompanyByLineDestination(body.destination ?? "");
  if (
    !company ||
    !company.lineChannelSecret ||
    !company.lineChannelAccessToken ||
    !isSubscriptionUsable(company.subscriptionStatus)
  ) {
    return NextResponse.json({ error: "unknown channel" }, { status: 404 });
  }

  if (!verifyLineSignature(rawBody, signature, company.lineChannelSecret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  for (const event of body.events ?? []) {
    if (event.type !== "message") continue;

    const userId = event.source.userId;

    try {
      if (event.message.type === "text") {
        const text = event.message.text.trim();

        // 通知登録用のワンタイムコード(ダッシュボードで発行)が送られてきた場合は、
        // 通常の案件受付フローには回さず、通知先として登録するだけにする。
        if (company.ownerRegistrationCode && text === company.ownerRegistrationCode) {
          await confirmOwnerRegistration(company.id, userId);
          await replyToLine(
            event.replyToken,
            "通知の登録が完了しました。今後、新しい問い合わせや作業完了報告があった際にお知らせします。",
            company.lineChannelAccessToken
          );
          continue;
        }

        const openJob = await getOpenJob(company.id, userId);
        const extracted = await extractJobInfo(text, openJob ?? undefined);
        await finalizeJob(
          company,
          userId,
          openJob?.id ?? null,
          extracted,
          event.replyToken,
          extracted.replyMessage,
          dashboardUrl
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
          photoPath: photoPath ?? openJob?.photoPath ?? null,
        };

        const missingFields = getMissingFields(state);
        const replyText =
          missingFields.length === 0
            ? "写真を受け取りました。ありがとうございます。担当より折り返しご連絡いたします。"
            : buildMissingFieldsReply(missingFields);

        await finalizeJob(
          company,
          userId,
          openJob?.id ?? null,
          state,
          event.replyToken,
          replyText,
          dashboardUrl
        );
      }
    } catch (err) {
      console.error("LINE webhook event processing failed:", err);
      try {
        await replyToLine(event.replyToken, FALLBACK_REPLY, company.lineChannelAccessToken);
      } catch (replyErr) {
        console.error("Fallback reply also failed:", replyErr);
      }
      // お客様への返信は失敗時用の定型文で済むが、それだけだと事業主は
      // 対応漏れに気づけない。オーナー登録済みなら異常発生をLINEで知らせる。
      try {
        await notifyOwner(
          company,
          [
            "【エラー通知】",
            "お客様からのメッセージ処理中にエラーが発生しました。",
            "お客様には「混み合っている」旨の自動返信のみ送られています。",
            "お手数ですが、該当のお客様に直接ご確認・ご連絡をお願いします。",
          ].join("\n")
        );
      } catch (notifyErr) {
        console.error("Owner error notification also failed:", notifyErr);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
