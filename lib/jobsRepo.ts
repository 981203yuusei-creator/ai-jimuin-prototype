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
};

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

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    workType: row.work_type,
    urgency: row.urgency,
    status: row.status,
    photoPath: row.photo_path,
    calendarEventId: row.calendar_event_id,
    createdAt: row.created_at,
  }));
}
