import { NextRequest, NextResponse } from "next/server";
import { createManualJob, JobEditableFields } from "../../../../lib/jobsRepo";
import { getCompanyById } from "../../../../lib/companies";
import { registerJobToCalendar } from "../../../../lib/calendar";

const URGENCY_VALUES = ["high", "normal", "low"];
const STATUS_VALUES = ["collecting", "completed", "done"];

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
    urgency: URGENCY_VALUES.includes(body.urgency) ? body.urgency : "normal",
    status: STATUS_VALUES.includes(body.status) ? body.status : "completed",
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
        urgency: fields.urgency as "high" | "normal" | "low",
        photoPath: null,
      },
      company?.calendarId ?? null
    );
  }

  const created = await createManualJob(companyId, fields, calendarEventId);
  if (!created) {
    return NextResponse.json({ error: "create failed" }, { status: 500 });
  }

  return NextResponse.json({ job: created });
}
