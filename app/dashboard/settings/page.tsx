import { headers } from "next/headers";
import { getCompanyById } from "../../../lib/companies";
import NotifySettings from "../NotifySettings";
import EmailSettings from "../EmailSettings";
import CompanyProfileSettings from "../CompanyProfileSettings";
import ChangePasswordForm from "../ChangePasswordForm";
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

      <NotifySettings connected={!!company?.ownerLineUserId} />

      <EmailSettings currentEmail={company?.email ?? null} />

      <CompanyProfileSettings
        initialAddress={company?.contactAddress ?? null}
        initialPhone={company?.contactPhone ?? null}
        initialInvoiceRegistrationNumber={company?.invoiceRegistrationNumber ?? null}
      />

      <ChangePasswordForm />
    </div>
  );
}
