import { NextRequest, NextResponse } from "next/server";
import { updateLineIntegration } from "../../../../lib/companies";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { lineChannelId, lineChannelSecret, lineChannelAccessToken, calendarId } = await req.json();

  const ok = await updateLineIntegration(companyId, {
    lineChannelId: (lineChannelId ?? "").trim(),
    lineChannelSecret: (lineChannelSecret ?? "").trim(),
    lineChannelAccessToken: (lineChannelAccessToken ?? "").trim(),
    calendarId: (calendarId ?? "").trim(),
  });
  if (!ok) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
