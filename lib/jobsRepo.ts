import { getSupabase } from "./supabase";
import { JobState } from "./extractInfo";

export type OpenJob = JobState & {
  id: string;
};

export async function getOpenJob(lineUserId: string): Promise<OpenJob | null> {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
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
  };
}

export async function saveJob(
  lineUserId: string,
  existingId: string | null,
  state: JobState,
  completed: boolean,
  calendarEventId: string | null
): Promise<void> {
  const payload = {
    line_user_id: lineUserId,
    name: state.name,
    phone: state.phone,
    address: state.address,
    work_type: state.workType,
    urgency: state.urgency,
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
