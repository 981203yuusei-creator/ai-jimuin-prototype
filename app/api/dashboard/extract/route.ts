import { NextRequest, NextResponse } from "next/server";
import { extractJobInfo } from "../../../../lib/extractInfo";

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const extracted = await extractJobInfo(text.trim());

  return NextResponse.json({
    name: extracted.name,
    phone: extracted.phone,
    address: extracted.address,
    workType: extracted.workType,
  });
}
