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
    urgency: data.urgency,
    photoPath: data.photo_path,
  };
}

export async function saveJob(
  companyId: string,
  lineUserId: string,
  existingId: string | null,
  state: JobState,
  completed: boolean,
  calendarEventId: string | null
): Promise<void> {
  const payload = {
    company_id: companyId,
    line_user_id: lineUserId,
    name: state.name,
    phone: state.phone,
    address: state.address,
    work_type: state.workType,
    urgency: state.urgency,
    photo_path: state.photoPath,
    status: completed ? "completed" : "collecting",
    calendar_event_id: calendarEventId,
    updated_at: new Date().toISOString(),
  };

  const db = getSupabase();
  const { error } = existingId
    ? await db.from("jobs").update(payload).eq("id", existingId)
    : await db.from("jobs").insert(payload);

  if (error) {
    console.error("saveJob failed:", error);
  }
}

export type DashboardJob = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  urgency: string;
  status: string;
  photoPath: string | null;
  calendarEventId: string | null;
  createdAt: string;
  reportComment: string | null;
  reportPhotoPath: string | null;
};

function mapDashboardJob(data: any): DashboardJob {
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    address: data.address,
    workType: data.work_type,
    urgency: data.urgency,
    status: data.status,
    photoPath: data.photo_path,
    calendarEventId: data.calendar_event_id,
    createdAt: data.created_at,
    reportComment: data.report_comment,
    reportPhotoPath: data.report_photo_path,
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

export type JobEditableFields = {
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  urgency: string;
  status: string;
};

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
      urgency: fields.urgency,
      status: fields.status,
      calendar_event_id: calendarEventId,
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
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("listJobsForCompany failed:", error);
    return [];
  }

  return (data ?? []).map(mapDashboardJob);
}

export type PublicJob = {
  id: string;
  companyId: string;
  workType: string | null;
  address: string | null;
};

export async function getJobForReport(jobId: string): Promise<PublicJob | null> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("id, company_id, work_type, address")
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
    workType: data.work_type,
    address: data.address,
  };
}

export async function submitJobReport(
  jobId: string,
  comment: string | null,
  photoPath: string | null
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("jobs")
    .update({
      report_comment: comment,
      report_photo_path: photoPath,
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
