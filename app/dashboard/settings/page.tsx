import { headers } from "next/headers";
import { getCompanyById } from "../../../lib/companies";
import { getConfirmedReferralCount } from "../../../lib/referrals";
import LineIntegrationSettings from "../LineIntegrationSettings";
import ReferralSettings from "../ReferralSettings";
import NotifySettings from "../NotifySettings";
import EmailSettings from "../EmailSettings";
import CompanyProfileSettings from "../CompanyProfileSettings";
import IntegrationSettings from "../IntegrationSettings";
import ChangePasswordForm from "../ChangePasswordForm";
import BillingPortalButton from "../BillingPortalButton";
import FontSizeControl from "../FontSizeControl";

export default async function SettingsPage() {
  const companyId = headers().get("x-company-id") ?? "";
  const [company, confirmedReferralCount] = await Promise.all([
    getCompanyById(companyId),
    getConfirmedReferralCount(companyId),
  ]);

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20 }}>設定</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <FontSizeControl />
          <a href="/dashboard">← 案件一覧に戻る</a>
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid #eee",
        }}
      >
        {[
          ["#line", "LINE連携"],
          ["#notify", "LINE通知"],
          ["#email", "メール"],
          ["#profile", "会社情報"],
          ["#referral", "紹介プログラム"],
          ["#integration", "外部連携"],
          ...(company?.stripeCustomerId ? [["#billing", "お支払い"]] : []),
          ["#password", "パスワード"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 12,
              border: "1px solid #ccc",
              color: "#333",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <div id="line">
        <LineIntegrationSettings
          initialLineChannelId={company?.lineChannelId ?? null}
          initialLineChannelSecret={company?.lineChannelSecret ?? null}
          initialLineChannelAccessToken={company?.lineChannelAccessToken ?? null}
          initialCalendarId={company?.calendarId ?? null}
        />
      </div>

      <div id="notify">
        <NotifySettings connected={!!company?.ownerLineUserId} />
      </div>

      <div id="email">
        <EmailSettings currentEmail={company?.email ?? null} />
      </div>

      <div id="profile">
        <CompanyProfileSettings
          initialAddress={company?.contactAddress ?? null}
          initialPhone={company?.contactPhone ?? null}
          initialInvoiceRegistrationNumber={company?.invoiceRegistrationNumber ?? null}
        />
      </div>

      <div id="referral">
        <ReferralSettings
          referralCode={company?.referralCode ?? null}
          confirmedCount={confirmedReferralCount}
        />
      </div>

      <div id="integration">
        <IntegrationSettings initialApiKey={company?.integrationApiKey ?? null} />
      </div>

      {company?.stripeCustomerId && (
        <div id="billing">
          <BillingPortalButton />
        </div>
      )}

      <div id="password">
        <ChangePasswordForm />
      </div>

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
