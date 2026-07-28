import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";
import { getCompanyById } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const company = await getCompanyById(companyId);
  if (!company?.stripeCustomerId) {
    return NextResponse.json({ error: "no stripe customer" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const session = await getStripe().billingPortal.sessions.create({
    customer: company.stripeCustomerId,
    return_url: `${origin}/dashboard/settings`,
  });

  return NextResponse.json({ url: session.url });
}
