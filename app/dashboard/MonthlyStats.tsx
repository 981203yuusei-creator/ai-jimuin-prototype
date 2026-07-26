import { JST_TIME_ZONE } from "../../lib/time";

function monthKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: JST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).format(new Date(iso));
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  return `${year}年${Number(month)}月`;
}

export default function MonthlyStats({
  jobs,
}: {
  jobs: { status: string; createdAt: string; invoiceAmount: number | null }[];
}) {
  const groups = new Map<string, { count: number; revenue: number }>();
  for (const job of jobs) {
    const key = monthKey(job.createdAt);
    const g = groups.get(key) ?? { count: 0, revenue: 0 };
    g.count += 1;
    if (job.status === "done" && job.invoiceAmount) g.revenue += job.invoiceAmount;
    groups.set(key, g);
  }

  const rows = Array.from(groups.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  if (rows.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>月別集計</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: "4px 20px 4px 0" }}>月</th>
              <th style={{ padding: "4px 20px" }}>案件数</th>
              <th style={{ padding: "4px 20px" }}>売上金(請求済み分)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([key, g]) => (
              <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "4px 20px 4px 0", whiteSpace: "nowrap" }}>{monthLabel(key)}</td>
                <td style={{ padding: "4px 20px" }}>{g.count}件</td>
                <td style={{ padding: "4px 20px" }}>¥{g.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
