import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  createPendingCompany,
  getCompanyByDashboardUsername,
} from "../../../lib/companies";
import { getStripe } from "../../../lib/stripe";

export async function POST(req: NextRequest) {
  const { companyName, username, password, email } = await req.json();

  if (!companyName || !username || !password || !email) {
    return NextResponse.json({ error: "全ての項目を入力してください" }, { status: 400 });
  }
  if (String(password).length < 8) {
    return NextResponse.json({ error: "パスワードは8文字以上にしてください" }, { status: 400 });
  }

  const existing = await getCompanyByDashboardUsername(username);
  if (existing) {
    return NextResponse.json({ error: "このユーザー名は既に使われています" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const company = await createPendingCompany({
    name: companyName,
    dashboardUsername: username,
    dashboardPasswordHash: passwordHash,
    email,
  });

  if (!company) {
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }

  const origin = new URL(req.url).origin;
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    customer_email: email,
    client_reference_id: company.id,
    metadata: { companyId: company.id },
    subscription_data: { metadata: { companyId: company.id } },
    success_url: `${origin}/signup/complete`,
    cancel_url: `${origin}/signup`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "決済ページの作成に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
