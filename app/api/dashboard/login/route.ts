import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCompanyByDashboardUsername } from "../../../../lib/companies";
import { createSessionCookieValue, COOKIE_NAME } from "../../../../lib/session";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const company = username ? await getCompanyByDashboardUsername(username) : null;
  const valid = company ? await bcrypt.compare(password ?? "", company.dashboardPasswordHash) : false;

  if (!company || !valid) {
    return NextResponse.json({ error: "ユーザー名またはパスワードが違います" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await createSessionCookieValue(company.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
