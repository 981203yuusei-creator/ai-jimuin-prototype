import { getJobForReport } from "../../../lib/jobsRepo";
import ReportForm from "./ReportForm";

export default async function ReportPage({ params }: { params: { id: string } }) {
  const job = await getJobForReport(params.id);

  if (!job) {
    return (
      <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif", textAlign: "center" }}>
        <p>案件が見つかりませんでした。</p>
      </div>
    );
  }

  const mapUrl = job.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`
    : null;
  const telUrl = job.phone ? `tel:${job.phone.replace(/[^0-9+]/g, "")}` : null;

  return (
    <div style={{ maxWidth: 320, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>作業指示書</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "#f9fafb",
        }}
      >
        {job.jobNumber && (
          <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>案件No. {job.jobNumber}</div>
        )}
        <div style={{ fontSize: 16, fontWeight: 600 }}>{job.workType ?? "作業内容未確認"}</div>
        <div style={{ fontSize: 14, marginTop: 4 }}>{job.name ?? "お客様名未確認"} 様</div>
        {job.address && (
          <div style={{ marginTop: 8 }}>
            <a href={mapUrl ?? undefined} target="_blank" rel="noreferrer" style={{ color: "#1d4ed8" }}>
              📍 {job.address}
            </a>
          </div>
        )}
        {job.phone && (
          <div style={{ marginTop: 4 }}>
            <a href={telUrl ?? undefined} style={{ color: "#1d4ed8" }}>
              📞 {job.phone}
            </a>
          </div>
        )}
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 8 }}>作業完了報告</h2>
      <ReportForm jobId={job.id} />
    </div>
  );
}
