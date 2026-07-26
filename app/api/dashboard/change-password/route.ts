import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCompanyById, updateDashboardPasswordHash } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "新しいパスワードは8文字以上にしてください" },
      { status: 400 }
    );
  }

  const company = await getCompanyById(companyId);
  if (!company) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword ?? "", company.dashboardPasswordHash);
  if (!valid) {
    return NextResponse.json({ error: "現在のパスワードが違います" }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  const ok = await updateDashboardPasswordHash(companyId, newHash);
  if (!ok) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
