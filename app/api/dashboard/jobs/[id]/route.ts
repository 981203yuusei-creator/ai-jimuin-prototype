import { NextRequest, NextResponse } from "next/server";
import { getJobForCompany, updateJobForCompany, JobEditableFields } from "../../../../../lib/jobsRepo";
import { getCompanyById } from "../../../../../lib/companies";
import { registerJobToCalendar } from "../../../../../lib/calendar";

const URGENCY_VALUES = ["high", "normal", "low"];
const STATUS_VALUES = ["collecting", "completed", "done"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const existing = await getJobForCompany(companyId, params.id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = await req.json();
  const fields: JobEditableFields = {
    name: body.name?.trim() || null,
    phone: body.phone?.trim() || null,
    address: body.address?.trim() || null,
    workType: body.workType?.trim() || null,
    urgency: URGENCY_VALUES.includes(body.urgency) ? body.urgency : existing.urgency,
    status: STATUS_VALUES.includes(body.status) ? body.status : existing.status,
  };

  let calendarEventId = existing.calendarEventId;
  if ((fields.status === "completed" || fields.status === "done") && !calendarEventId) {
    const company = await getCompanyById(companyId);
    calendarEventId = await registerJobToCalendar(
      {
        name: fields.name,
        phone: fields.phone,
        address: fields.address,
        workType: fields.workType,
        urgency: fields.urgency as "high" | "normal" | "low",
        photoPath: existing.photoPath,
      },
      company?.calendarId ?? null
    );
  }

  const updated = await updateJobForCompany(companyId, params.id, fields, calendarEventId);
  if (!updated) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ job: updated });
}
