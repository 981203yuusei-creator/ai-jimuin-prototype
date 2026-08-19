import { NextRequest, NextResponse } from "next/server";
import {
  getJobForCompany,
  updateJobForCompany,
  deleteJobForCompany,
  JobEditableFields,
} from "../../../../../lib/jobsRepo";
import { getCompanyById } from "../../../../../lib/companies";
import {
  registerJobToCalendar,
  rescheduleCalendarEvent,
  deleteCalendarEvent,
} from "../../../../../lib/calendar";
import { deleteJobPhotos } from "../../../../../lib/storage";

const STATUS_VALUES = ["collecting", "completed", "done"];

function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

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
    status: STATUS_VALUES.includes(body.status) ? body.status : existing.status,
    scheduledAt: body.scheduledAt || null,
    quoteAmount: parseAmount(body.quoteAmount),
    invoiceAmount: parseAmount(body.invoiceAmount),
    invoiceNote: body.invoiceNote?.trim() || null,
    isPaid: Boolean(body.isPaid),
  };

  const jobState = {
    name: fields.name,
    phone: fields.phone,
    address: fields.address,
    workType: fields.workType,
    photoPath: existing.photoPath,
  };

  let calendarEventId = existing.calendarEventId;
  const company =
    (fields.status === "completed" || fields.status === "done") ||
    (fields.scheduledAt && fields.scheduledAt !== existing.scheduledAt)
      ? await getCompanyById(companyId)
      : null;

  if ((fields.status === "completed" || fields.status === "done") && !calendarEventId) {
    calendarEventId = await registerJobToCalendar(jobState, company?.calendarId ?? null, fields.scheduledAt);
  } else if (calendarEventId && fields.scheduledAt && fields.scheduledAt !== existing.scheduledAt) {
    await rescheduleCalendarEvent(company?.calendarId ?? null, calendarEventId, jobState, fields.scheduledAt);
  }

  const updated = await updateJobForCompany(companyId, params.id, fields, calendarEventId);
  if (!updated) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ job: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const companyId = req.headers.get("x-company-id");
  if (!companyId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const existing = await getJobForCompany(companyId, params.id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  if (existing.calendarEventId) {
    const company = await getCompanyById(companyId);
    await deleteCalendarEvent(company?.calendarId ?? null, existing.calendarEventId);
  }
  await deleteJobPhotos([existing.photoPath, existing.reportPhotoPath]);

  const ok = await deleteJobForCompany(companyId, params.id);
  if (!ok) {
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
