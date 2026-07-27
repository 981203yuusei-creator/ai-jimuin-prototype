import { NextRequest, NextResponse } from "next/server";
import { listJobsForCompany } from "../../../../lib/jobsRepo";

function csvField(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatJst(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const STATUS_LABELS: Record<string, string> = {
  collecting: "受付中",
  completed: "受付完了(対応待ち)",
  done: "作業完了",
};

const HEADER = [
  "案件No",
  "受付日時",
  "ステータス",
  "お客様名",
  "電話番号",
  "住所",
  "作業内容",
  "訪問予定日時",
  "完了日時",
  "見積金額",
  "請求金額",
  "備考",
];

export async function GET(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const jobs = await listJobsForCompany(companyId);

  const lines = [HEADER.join(",")];
  for (const job of jobs) {
    lines.push(
      [
        csvField(job.jobNumber),
        csvField(formatJst(job.createdAt)),
        csvField(STATUS_LABELS[job.status] ?? job.status),
        csvField(job.name),
        csvField(job.phone),
        csvField(job.address),
        csvField(job.workType),
        csvField(formatJst(job.scheduledAt)),
        csvField(formatJst(job.reportCompletedAt)),
        csvField(job.quoteAmount),
        csvField(job.invoiceAmount),
        csvField(job.invoiceNote),
      ].join(",")
    );
  }

  const csv = "﻿" + lines.join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="jobs.csv"`,
    },
  });
}
