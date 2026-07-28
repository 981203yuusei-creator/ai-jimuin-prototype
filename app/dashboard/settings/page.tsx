import { headers } from "next/headers";
import { getCompanyById } from "../../../lib/companies";
import LineIntegrationSettings from "../LineIntegrationSettings";
import NotifySettings from "../NotifySettings";
import EmailSettings from "../EmailSettings";
import CompanyProfileSettings from "../CompanyProfileSettings";
import ChangePasswordForm from "../ChangePasswordForm";
import BillingPortalButton from "../BillingPortalButton";
import FontSizeControl from "../FontSizeControl";

export default async function SettingsPage() {
  const companyId = headers().get("x-company-id") ?? "";
  const company = await getCompanyById(companyId);

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20 }}>設定</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <FontSizeControl />
          <a href="/dashboard">← 案件一覧に戻る</a>
        </div>
      </div>

      <LineIntegrationSettings
        initialLineChannelId={company?.lineChannelId ?? null}
        initialLineChannelSecret={company?.lineChannelSecret ?? null}
        initialLineChannelAccessToken={company?.lineChannelAccessToken ?? null}
        initialCalendarId={company?.calendarId ?? null}
      />

      <NotifySettings connected={!!company?.ownerLineUserId} />

      <EmailSettings currentEmail={company?.email ?? null} />

      <CompanyProfileSettings
        initialAddress={company?.contactAddress ?? null}
        initialPhone={company?.contactPhone ?? null}
        initialInvoiceRegistrationNumber={company?.invoiceRegistrationNumber ?? null}
      />

      {company?.stripeCustomerId && <BillingPortalButton />}

      <ChangePasswordForm />

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #eee", fontSize: 12, color: "#999" }}>
        <p>サポート窓口: 準備中</p>
        <p style={{ marginTop: 4 }}>
          <a href="/legal/terms">利用規約</a>
          {" ・ "}
          <a href="/legal/privacy">プライバシーポリシー</a>
          {" ・ "}
          <a href="/legal/tokushoho">特定商取引法に基づく表記</a>
        </p>
      </div>
    </div>
  );
}
