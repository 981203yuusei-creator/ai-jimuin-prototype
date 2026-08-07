import { NextRequest, NextResponse } from "next/server";
import { generateNotePost, recordNotePost } from "../../../../lib/notePost";
import { postToNote } from "../../../../lib/noteAutomation";

export const maxDuration = 120;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const generated = await generateNotePost();
  if (!generated) {
    return NextResponse.json({ error: "generation failed" }, { status: 500 });
  }

  const result = await postToNote(generated.title, generated.paragraphs);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await recordNotePost(generated.title, result.url);

  return NextResponse.json({ ok: true, title: generated.title, url: result.url });
}
