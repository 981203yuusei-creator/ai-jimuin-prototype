import { google } from "googleapis";
import { JobState } from "./extractInfo";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function registerJobToCalendar(job: JobState): Promise<string | null> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.error("registerJobToCalendar skipped: GOOGLE_CALENDAR_ID is not set");
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const calendar = google.calendar({ version: "v3", auth: getAuth() });
    const res = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `【新規問合せ】${job.workType ?? "工事"} - ${job.name ?? "お客様"}`,
        description: [
          `電話番号: ${job.phone ?? "未確認"}`,
          `住所: ${job.address ?? "未確認"}`,
          `緊急度: ${job.urgency}`,
          "",
          "※日時未確定。要連絡・スケジュール調整。",
        ].join("\n"),
        start: { date: today },
        end: { date: today },
      },
    });
    return res.data.id ?? null;
  } catch (err) {
    console.error("Google Calendar登録失敗:", err);
    return null;
  }
}
