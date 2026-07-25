import { NextRequest, NextResponse } from "next/server";
import { generateOwnerRegistrationCode } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const code = await generateOwnerRegistrationCode(companyId);
  if (!code) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }

  return NextResponse.json({ code });
}
