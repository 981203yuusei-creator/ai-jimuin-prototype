import { NextRequest, NextResponse } from "next/server";
import { generateAndSaveBlogPost } from "../../../../lib/blog";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ok = await generateAndSaveBlogPost();
  if (!ok) {
    return NextResponse.json({ error: "generation failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
