import { google } from "googleapis";
import { JobState } from "./extractInfo";
import { todayInJst, addHoursIso } from "./time";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

function jobDescription(job: JobState): string {
  return [`電話番号: ${job.phone ?? "未確認"}`, `住所: ${job.address ?? "未確認"}`].join("\n");
}

export async function registerJobToCalendar(
  job: JobState,
  calendarId: string | null,
  scheduledAt?: string | null
): Promise<string | null> {
  if (!calendarId) {
    console.error("registerJobToCalendar skipped: company has no calendarId set");
    return null;
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: getAuth() });
    const requestBody = scheduledAt
      ? {
          summary: `${job.workType ?? "工事"} - ${job.name ?? "お客様"}`,
          description: jobDescription(job),
          start: { dateTime: scheduledAt },
          end: { dateTime: addHoursIso(scheduledAt, 1) },
        }
      : {
          summary: `【新規問合せ】${job.workType ?? "工事"} - ${job.name ?? "お客様"}`,
          description: [jobDescription(job), "", "※日時未確定。要連絡・スケジュール調整。"].join("\n"),
          start: { date: todayInJst() },
          end: { date: todayInJst() },
        };

    const res = await calendar.events.insert({ calendarId, requestBody });
    return res.data.id ?? null;
  } catch (err) {
    console.error("Google Calendar登録失敗:", err);
    return null;
  }
}

export async function rescheduleCalendarEvent(
  calendarId: string | null,
  eventId: string | null,
  job: JobState,
  scheduledAt: string
): Promise<boolean> {
  if (!calendarId || !eventId) return false;

  try {
    const calendar = google.calendar({ version: "v3", auth: getAuth() });
    // 終日イベント(date)から時刻指定イベント(dateTime)への変換は、events.patchだと
    // 内部で古いdateフィールドと新しいdateTimeフィールドが競合し
    // 「Invalid start time」で失敗するため、全体を置き換えるevents.updateを使う。
    await calendar.events.update({
      calendarId,
      eventId,
      requestBody: {
        summary: `${job.workType ?? "工事"} - ${job.name ?? "お客様"}`,
        description: jobDescription(job),
        start: { dateTime: scheduledAt },
        end: { dateTime: addHoursIso(scheduledAt, 1) },
      },
    });
    return true;
  } catch (err) {
    console.error("Google Calendar更新失敗:", err);
    return false;
  }
}

export async function deleteCalendarEvent(
  calendarId: string | null,
  eventId: string | null
): Promise<void> {
  if (!calendarId || !eventId) return;

  try {
    const calendar = google.calendar({ version: "v3", auth: getAuth() });
    await calendar.events.delete({ calendarId, eventId });
  } catch (err) {
    console.error("Google Calendar削除失敗:", err);
  }
}
