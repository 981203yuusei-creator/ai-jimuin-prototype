import { NextRequest, NextResponse } from "next/server";
import { getJobForReport, submitJobReport } from "../../../../lib/jobsRepo";
import { uploadReportPhoto } from "../../../../lib/storage";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const job = await getJobForReport(params.id);
  if (!job) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const comment = (formData.get("comment") as string | null)?.trim() || null;
  const photo = formData.get("photo") as File | null;

  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const buffer = Buffer.from(await photo.arrayBuffer());
    photoPath = await uploadReportPhoto(job.companyId, job.id, buffer, photo.type || "image/jpeg");
  }

  const ok = await submitJobReport(job.id, comment, photoPath);
  if (!ok) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
