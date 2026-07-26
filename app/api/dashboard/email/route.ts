import { NextRequest, NextResponse } from "next/server";
import { updateCompanyEmail } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
  }

  const ok = await updateCompanyEmail(companyId, email.trim());
  if (!ok) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
