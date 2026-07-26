import { NextRequest, NextResponse } from "next/server";
import { updateCompanyProfile } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { contactAddress, contactPhone, invoiceRegistrationNumber } = await req.json();

  const ok = await updateCompanyProfile(
    companyId,
    (contactAddress ?? "").trim(),
    (contactPhone ?? "").trim(),
    (invoiceRegistrationNumber ?? "").trim()
  );
  if (!ok) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
