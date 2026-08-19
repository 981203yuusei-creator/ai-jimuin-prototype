import { getSupabase } from "./supabase";
import { JobState } from "./extractInfo";

export type OpenJob = JobState & {
  id: string;
};

export async function getOpenJob(companyId: string, lineUserId: string): Promise<OpenJob | null> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .eq("line_user_id", lineUserId)
    .eq("status", "collecting")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getOpenJob failed:", error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    address: data.address,
    workType: data.work_type,
    photoPath: data.photo_path,
  };
}

async function nextJobNumber(companyId: string): Promise<number> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("job_number")
    .eq("company_id", companyId)
    .order("job_number", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("nextJobNumber failed:", error);
  }
  return (data?.job_number ?? 0) + 1;
}

export async function saveJob(
  companyId: string,
  lineUserId: string,
  existingId: string | null,
  state: JobState,
  completed: boolean,
  calendarEventId: string | null
): Promise<string | null> {
  const payload = {
    company_id: companyId,
    line_user_id: lineUserId,
    name: state.name,
    phone: state.phone,
    address: state.address,
    work_type: state.workType,
    photo_path: state.photoPath,
    status: completed ? "completed" : "collecting",
    calendar_event_id: calendarEventId,
    updated_at: new Date().toISOString(),
  };

  const db = getSupabase();

  if (existingId) {
    const { error } = await db.from("jobs").update(payload).eq("id", existingId);
    if (error) {
      console.error("saveJob failed:", error);
      return null;
    }
    return existingId;
  }

  const { data, error } = await db
    .from("jobs")
    .insert({ ...payload, job_number: await nextJobNumber(companyId) })
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("saveJob failed:", error);
    return null;
  }
  return data?.id ?? null;
}

export type DashboardJob = {
  id: string;
  jobNumber: number | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  status: string;
  photoPath: string | null;
  calendarEventId: string | null;
  createdAt: string;
  reportComment: string | null;
  reportPhotoPath: string | null;
  reportWorkerName: string | null;
  reportStartedAt: string | null;
  reportCompletedAt: string | null;
  scheduledAt: string | null;
  quoteAmount: number | null;
  invoiceAmount: number | null;
  invoiceNote: string | null;
  isPaid: boolean;
};

function mapDashboardJob(data: any): DashboardJob {
  return {
    id: data.id,
    jobNumber: data.job_number,
    name: data.name,
    phone: data.phone,
    address: data.address,
    workType: data.work_type,
    status: data.status,
    photoPath: data.photo_path,
    calendarEventId: data.calendar_event_id,
    createdAt: data.created_at,
    reportComment: data.report_comment,
    reportPhotoPath: data.report_photo_path,
    reportWorkerName: data.report_worker_name,
    reportStartedAt: data.report_started_at,
    reportCompletedAt: data.report_completed_at,
    scheduledAt: data.scheduled_at,
    quoteAmount: data.quote_amount,
    invoiceAmount: data.invoice_amount,
    invoiceNote: data.invoice_note,
    isPaid: data.is_paid ?? false,
  };
}

export async function getJobForCompany(companyId: string, jobId: string): Promise<DashboardJob | null> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    console.error("getJobForCompany failed:", error);
    return null;
  }
  return data ? mapDashboardJob(data) : null;
}

export async function deleteJobForCompany(companyId: string, jobId: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from("jobs")
    .delete()
    .eq("company_id", companyId)
    .eq("id", jobId);

  if (error) {
    console.error("deleteJobForCompany failed:", error);
    return false;
  }
  return true;
}

export type JobEditableFields = {
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  status: string;
  scheduledAt: string | null;
  quoteAmount: number | null;
  invoiceAmount: number | null;
  invoiceNote: string | null;
  isPaid: boolean;
};

export async function createManualJob(
  companyId: string,
  fields: JobEditableFields,
  calendarEventId: string | null
): Promise<DashboardJob | null> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .insert({
      company_id: companyId,
      job_number: await nextJobNumber(companyId),
      line_user_id: null,
      name: fields.name,
      phone: fields.phone,
      address: fields.address,
      work_type: fields.workType,
      status: fields.status,
      calendar_event_id: calendarEventId,
      scheduled_at: fields.scheduledAt,
      quote_amount: fields.quoteAmount,
      invoice_amount: fields.invoiceAmount,
      invoice_note: fields.invoiceNote,
      is_paid: fields.isPaid,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("createManualJob failed:", error);
    return null;
  }
  return data ? mapDashboardJob(data) : null;
}

export async function updateJobForCompany(
  companyId: string,
  jobId: string,
  fields: JobEditableFields,
  calendarEventId: string | null
): Promise<DashboardJob | null> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .update({
      name: fields.name,
      phone: fields.phone,
      address: fields.address,
      work_type: fields.workType,
      status: fields.status,
      calendar_event_id: calendarEventId,
      scheduled_at: fields.scheduledAt,
      quote_amount: fields.quoteAmount,
      invoice_amount: fields.invoiceAmount,
      invoice_note: fields.invoiceNote,
      is_paid: fields.isPaid,
      updated_at: new Date().toISOString(),
    })
    .eq("company_id", companyId)
    .eq("id", jobId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("updateJobForCompany failed:", error);
    return null;
  }
  return data ? mapDashboardJob(data) : null;
}

export async function listJobsForCompany(companyId: string): Promise<DashboardJob[]> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true })
    .limit(5000);

  if (error) {
    console.error("listJobsForCompany failed:", error);
    return [];
  }

  return (data ?? []).map(mapDashboardJob);
}

export type PublicJob = {
  id: string;
  companyId: string;
  jobNumber: number | null;
  name: string | null;
  phone: string | null;
  workType: string | null;
  address: string | null;
};

export async function getJobForReport(jobId: string): Promise<PublicJob | null> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("id, company_id, job_number, name, phone, work_type, address")
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    console.error("getJobForReport failed:", error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    companyId: data.company_id,
    jobNumber: data.job_number,
    name: data.name,
    phone: data.phone,
    workType: data.work_type,
    address: data.address,
  };
}

export type JobReportInput = {
  comment: string | null;
  photoPath: string | null;
  workerName: string | null;
  startedAt: string | null;
  completedAt: string | null;
};

export async function submitJobReport(jobId: string, report: JobReportInput): Promise<boolean> {
  const { error } = await getSupabase()
    .from("jobs")
    .update({
      report_comment: report.comment,
      report_photo_path: report.photoPath,
      report_worker_name: report.workerName,
      report_started_at: report.startedAt,
      report_completed_at: report.completedAt,
      status: "done",
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (error) {
    console.error("submitJobReport failed:", error);
    return false;
  }
  return true;
}
