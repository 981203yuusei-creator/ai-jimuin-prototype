import { headers } from "next/headers";
import { getCompanyById } from "../../lib/companies";
import { listJobsForCompany } from "../../lib/jobsRepo";
import { getSignedPhotoUrl } from "../../lib/storage";
import LogoutButton from "./LogoutButton";

const URGENCY_LABEL: Record<string, string> = {
  high: "急ぎ",
  normal: "通常",
  low: "低",
};

const STATUS_LABEL: Record<string, string> = {
  collecting: "受付中",
  completed: "完了",
};

export default async function DashboardPage() {
  const companyId = headers().get("x-company-id") ?? "";
  const [company, jobs] = await Promise.all([
    getCompanyById(companyId),
    listJobsForCompany(companyId),
  ]);

  const jobsWithPhotoUrl = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      photoUrl: job.photoPath ? await getSignedPhotoUrl(job.photoPath) : null,
    }))
  );

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20 }}>案件一覧{company ? ` - ${company.name}` : ""}</h1>
        <LogoutButton />
      </div>

      {jobsWithPhotoUrl.length === 0 ? (
        <p>まだ案件がありません。</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: 8 }}>受付日時</th>
              <th style={{ padding: 8 }}>状態</th>
              <th style={{ padding: 8 }}>お名前</th>
              <th style={{ padding: 8 }}>電話番号</th>
              <th style={{ padding: 8 }}>住所</th>
              <th style={{ padding: 8 }}>工事内容</th>
              <th style={{ padding: 8 }}>緊急度</th>
              <th style={{ padding: 8 }}>写真</th>
              <th style={{ padding: 8 }}>カレンダー</th>
            </tr>
          </thead>
          <tbody>
            {jobsWithPhotoUrl.map((job) => (
              <tr key={job.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{new Date(job.createdAt).toLocaleString("ja-JP")}</td>
                <td style={{ padding: 8 }}>{STATUS_LABEL[job.status] ?? job.status}</td>
                <td style={{ padding: 8 }}>{job.name ?? "-"}</td>
                <td style={{ padding: 8 }}>{job.phone ?? "-"}</td>
                <td style={{ padding: 8 }}>{job.address ?? "-"}</td>
                <td style={{ padding: 8 }}>{job.workType ?? "-"}</td>
                <td style={{ padding: 8 }}>{URGENCY_LABEL[job.urgency] ?? job.urgency}</td>
                <td style={{ padding: 8 }}>
                  {job.photoUrl ? (
                    <a href={job.photoUrl} target="_blank" rel="noreferrer">
                      <img src={job.photoUrl} alt="現場写真" style={{ height: 48 }} />
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={{ padding: 8 }}>{job.calendarEventId ? "登録済み" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
