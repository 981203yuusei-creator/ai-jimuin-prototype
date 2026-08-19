import { NextRequest, NextResponse } from "next/server";
import { createManualJob, JobEditableFields } from "../../../../lib/jobsRepo";
import { getCompanyById } from "../../../../lib/companies";
import { registerJobToCalendar } from "../../../../lib/calendar";

const STATUS_VALUES = ["collecting", "completed", "done"];

function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const fields: JobEditableFields = {
    name: body.name?.trim() || null,
    phone: body.phone?.trim() || null,
    address: body.address?.trim() || null,
    workType: body.workType?.trim() || null,
    status: STATUS_VALUES.includes(body.status) ? body.status : "completed",
    scheduledAt: body.scheduledAt || null,
    quoteAmount: parseAmount(body.quoteAmount),
    invoiceAmount: parseAmount(body.invoiceAmount),
    invoiceNote: body.invoiceNote?.trim() || null,
    isPaid: false,
  };

  let calendarEventId: string | null = null;
  if (fields.status === "completed" || fields.status === "done") {
    const company = await getCompanyById(companyId);
    calendarEventId = await registerJobToCalendar(
      {
        name: fields.name,
        phone: fields.phone,
        address: fields.address,
        workType: fields.workType,
        photoPath: null,
      },
      company?.calendarId ?? null,
      fields.scheduledAt
    );
  }

  const created = await createManualJob(companyId, fields, calendarEventId);
  if (!created) {
    return NextResponse.json({ error: "create failed" }, { status: 500 });
  }

  return NextResponse.json({ job: created });
}
