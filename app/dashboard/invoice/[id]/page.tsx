import { headers } from "next/headers";
import { getCompanyById } from "../../../../lib/companies";
import { getJobForCompany } from "../../../../lib/jobsRepo";
import { todayInJst } from "../../../../lib/time";
import PrintButton from "./PrintButton";

function formatYen(amount: number | null): string {
  if (amount === null) return "-";
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: string };
}) {
  const companyId = headers().get("x-company-id") ?? "";
  const type = searchParams.type === "invoice" ? "invoice" : "quote";

  const [company, job] = await Promise.all([
    getCompanyById(companyId),
    getJobForCompany(companyId, params.id),
  ]);

  if (!job) {
    return <p style={{ padding: 24 }}>案件が見つかりません。</p>;
  }

  const title = type === "invoice" ? "御請求書" : "御見積書";
  const amount = type === "invoice" ? job.invoiceAmount : job.quoteAmount;
  const taxIncludedAmount = amount ?? 0;
  const subtotal = Math.round(taxIncludedAmount / 1.1);
  const tax = taxIncludedAmount - subtotal;

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <div className="no-print" style={{ marginBottom: 16 }}>
        <a href={`/dashboard/invoice/${job.id}?type=quote`} style={{ marginRight: 12 }}>
          見積書
        </a>
        <a href={`/dashboard/invoice/${job.id}?type=invoice`} style={{ marginRight: 12 }}>
          請求書
        </a>
        <PrintButton />
      </div>

      <div style={{ border: "1px solid #333", padding: 32 }}>
        <h1 style={{ textAlign: "center", fontSize: 24, letterSpacing: 8, marginBottom: 32 }}>
          {title}
        </h1>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 16, borderBottom: "1px solid #333", paddingBottom: 4 }}>
              {job.name ?? "お客様"} 様
            </p>
            <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>{job.address ?? ""}</p>
          </div>
          <div style={{ textAlign: "right", fontSize: 12 }}>
            <p>発行日: {todayInJst()}</p>
            <p style={{ marginTop: 12 }}>{company?.name ?? ""}</p>
            <p>{company?.contactAddress ?? ""}</p>
            <p>{company?.contactPhone ?? ""}</p>
            {company?.invoiceRegistrationNumber && (
              <p style={{ marginTop: 4 }}>登録番号: {company.invoiceRegistrationNumber}</p>
            )}
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #333", padding: 8, textAlign: "left" }}>作業内容</th>
              <th style={{ border: "1px solid #333", padding: 8, textAlign: "right", width: 140 }}>
                金額
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #333", padding: 8 }}>{job.workType ?? "-"}</td>
              <td style={{ border: "1px solid #333", padding: 8, textAlign: "right" }}>
                {formatYen(amount)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={{ border: "1px solid #333", padding: 8, textAlign: "right", fontWeight: 700 }}>
                合計
              </td>
              <td
                style={{
                  border: "1px solid #333",
                  padding: 8,
                  textAlign: "right",
                  fontWeight: 700,
                }}
              >
                {formatYen(amount)}
              </td>
            </tr>
          </tfoot>
        </table>

        {amount !== null && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
            <table style={{ fontSize: 13, color: "#333" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "2px 12px 2px 0" }}>10%対象 小計(税抜)</td>
                  <td style={{ padding: "2px 0", textAlign: "right" }}>{formatYen(subtotal)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 12px 2px 0" }}>内消費税(10%)</td>
                  <td style={{ padding: "2px 0", textAlign: "right" }}>{formatYen(tax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {job.invoiceNote && (
          <div>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>備考</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{job.invoiceNote}</p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none; }
        }
      `}</style>
    </div>
  );
}
