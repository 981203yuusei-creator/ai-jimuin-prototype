import { NextRequest, NextResponse } from "next/server";
import { generateNotePost, saveNoteDraft } from "../../../../lib/notePost";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const generated = await generateNotePost();
  if (!generated) {
    return NextResponse.json({ error: "generation failed" }, { status: 500 });
  }

  await saveNoteDraft(generated.title, generated.paragraphs);

  return NextResponse.json({ ok: true, title: generated.title });
}
