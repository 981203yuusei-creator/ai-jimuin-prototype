import { NextRequest, NextResponse } from "next/server";
import { getJobForReport, submitJobReport } from "../../../../lib/jobsRepo";
import { uploadReportPhoto } from "../../../../lib/storage";

function textField(formData: FormData, key: string): string | null {
  return (formData.get(key) as string | null)?.trim() || null;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const job = await getJobForReport(params.id);
  if (!job) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const comment = textField(formData, "comment");
  const workerName = textField(formData, "workerName");
  const startedAt = textField(formData, "startedAt");
  const completedAt = textField(formData, "completedAt");
  const photo = formData.get("photo") as File | null;

  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const buffer = Buffer.from(await photo.arrayBuffer());
    photoPath = await uploadReportPhoto(job.companyId, job.id, buffer, photo.type || "image/jpeg");
  }

  const ok = await submitJobReport(job.id, {
    comment,
    photoPath,
    workerName,
    startedAt,
    completedAt,
  });
  if (!ok) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
