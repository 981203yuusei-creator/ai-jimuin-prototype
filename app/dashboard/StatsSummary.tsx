import { JST_TIME_ZONE } from "../../lib/time";

function isThisMonthJst(iso: string): boolean {
  const format = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: JST_TIME_ZONE, year: "numeric", month: "2-digit" }).format(
      d
    );
  return format(new Date(iso)) === format(new Date());
}

export default function StatsSummary({
  jobs,
}: {
  jobs: { status: string; createdAt: string }[];
}) {
  const thisMonthJobs = jobs.filter((j) => isThisMonthJst(j.createdAt));
  const newThisMonth = thisMonthJobs.length;
  const doneThisMonth = thisMonthJobs.filter((j) => j.status === "done").length;
  const waiting = jobs.filter((j) => j.status === "collecting" || j.status === "completed").length;

  const stats = [
    { label: "今月の新規受付", value: newThisMonth },
    { label: "今月の作業完了", value: doneThisMonth },
    { label: "現在対応待ち", value: waiting },
  ];

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: "10px 16px",
            minWidth: 120,
          }}
        >
          <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}
