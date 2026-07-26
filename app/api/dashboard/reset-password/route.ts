import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCompanyByValidResetToken, resetPasswordWithToken } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "新しいパスワードは8文字以上にしてください" },
      { status: 400 }
    );
  }

  const company = await getCompanyByValidResetToken(token);
  if (!company) {
    return NextResponse.json({ error: "リンクが無効か有効期限が切れています" }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  const ok = await resetPasswordWithToken(company.id, hash);
  if (!ok) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
