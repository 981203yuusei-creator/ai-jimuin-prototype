import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCompanyByDashboardUsername, setPasswordResetToken } from "../../../../lib/companies";
import { sendPasswordResetEmail } from "../../../../lib/email";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  const company = username ? await getCompanyByDashboardUsername(username) : null;

  if (company?.email) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await setPasswordResetToken(company.id, token, expiresAt);

    const resetUrl = `${new URL(req.url).origin}/dashboard/reset-password?token=${token}`;
    await sendPasswordResetEmail(company.email, resetUrl);
  }

  // ユーザー名の存在有無が外部から判別できないよう、常に同じ応答を返す。
  return NextResponse.json({ ok: true });
}
