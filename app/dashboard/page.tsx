import { headers } from "next/headers";
import { getCompanyById, isSubscriptionUsable } from "../../lib/companies";
import { listJobsForCompany } from "../../lib/jobsRepo";
import { getSignedPhotoUrl } from "../../lib/storage";
import LogoutButton from "./LogoutButton";
import JobsTable from "./JobsTable";
import AutoRefresh from "./AutoRefresh";
import AddJobForm from "./AddJobForm";
import StatsSummary from "./StatsSummary";
import MonthlyStats from "./MonthlyStats";
import YearlyStats from "./YearlyStats";
import FontSizeControl from "./FontSizeControl";
import BillingPortalButton from "./BillingPortalButton";

export default async function DashboardPage() {
  const companyId = headers().get("x-company-id") ?? "";
  const [company, jobs] = await Promise.all([
    getCompanyById(companyId),
    listJobsForCompany(companyId),
  ]);

  if (company && !isSubscriptionUsable(company.subscriptionStatus)) {
    const status = company.subscriptionStatus;
    const isPending = status === "pending";
    // past_due/unpaid はStripeがカード決済を再試行している途中の状態で、
    // まだ解約は確定していない。「解約済み」と誤解させないよう分けて案内する。
    const isPaymentIssue = status === "past_due" || status === "unpaid";

    return (
      <div style={{ maxWidth: 400, margin: "80px auto", fontFamily: "sans-serif", padding: "0 16px", textAlign: "center" }}>
        <h1 style={{ fontSize: 18, marginBottom: 16 }}>
          {isPending ? "お支払いの確認待ちです" : isPaymentIssue ? "お支払いに問題が発生しています" : "ご契約は終了しています"}
        </h1>
        <p style={{ fontSize: 14, color: "#333" }}>
          {isPending
            ? "お支払いの確認が完了すると、自動的にダッシュボードをご利用いただけるようになります。しばらく経っても表示されない場合はお問い合わせください。"
            : isPaymentIssue
              ? "ご登録のクレジットカードでの決済に失敗しました。まだ解約はされていませんが、このままだとご利用が停止されます。下記からお支払い方法をご確認ください。"
              : "解約手続きが完了し、現在ダッシュボードはご利用いただけません。再度ご利用になる場合はお問い合わせください。"}
        </p>
        {isPaymentIssue && (
          <div style={{ marginTop: 20, textAlign: "left" }}>
            <BillingPortalButton />
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <LogoutButton />
        </div>
      </div>
    );
  }

  const jobRows = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      photoUrl: job.photoPath ? await getSignedPhotoUrl(job.photoPath) : null,
      reportPhotoUrl: job.reportPhotoPath ? await getSignedPhotoUrl(job.reportPhotoPath) : null,
    }))
  );

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <AutoRefresh />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20 }}>案件一覧{company ? ` - ${company.name}` : ""}</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <FontSizeControl />
          <a href="/dashboard/settings">設定</a>
          <LogoutButton />
        </div>
      </div>

      <StatsSummary jobs={jobs} />

      <div className="yearly-monthly-row">
        <div className="yearly-monthly-col">
          <YearlyStats jobs={jobs} />
        </div>
        <div className="yearly-monthly-col">
          <MonthlyStats jobs={jobs} />
        </div>
      </div>

      <style>{`
        @media (min-width: 800px) {
          .yearly-monthly-row {
            display: flex;
            gap: 32px;
            align-items: flex-start;
          }
          .yearly-monthly-col {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>

      <div style={{ marginBottom: 16 }}>
        <a href="/api/dashboard/export" style={{ fontSize: 14 }}>
          📥 案件データをCSVでダウンロード(確定申告・会計ソフト用)
        </a>
      </div>

      <AddJobForm />

      <JobsTable jobs={jobRows} />
    </div>
  );
}
