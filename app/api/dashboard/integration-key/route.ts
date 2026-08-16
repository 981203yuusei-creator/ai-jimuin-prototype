import { NextRequest, NextResponse } from "next/server";
import { regenerateIntegrationApiKey } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const key = await regenerateIntegrationApiKey(companyId);
  if (!key) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }

  return NextResponse.json({ key });
}
