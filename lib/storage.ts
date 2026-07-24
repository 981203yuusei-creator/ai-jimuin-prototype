import { getSupabase } from "./supabase";

const BUCKET = "job-photos";

export async function uploadJobPhoto(
  companyId: string,
  lineUserId: string,
  messageId: string,
  data: Buffer,
  contentType: string
): Promise<string | null> {
  const path = `${companyId}/${lineUserId}/${messageId}`;

  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(path, data, { contentType, upsert: true });

  if (error) {
    console.error("uploadJobPhoto failed:", error);
    return null;
  }
  return path;
}

export async function uploadReportPhoto(
  companyId: string,
  jobId: string,
  data: Buffer,
  contentType: string
): Promise<string | null> {
  const path = `${companyId}/reports/${jobId}/${Date.now()}`;

  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(path, data, { contentType, upsert: true });

  if (error) {
    console.error("uploadReportPhoto failed:", error);
    return null;
  }
  return path;
}

export async function getSignedPhotoUrl(path: string): Promise<string | null> {
  const { data, error } = await getSupabase()
    .storage.from(BUCKET)
    .createSignedUrl(path, 60 * 10);

  if (error) {
    console.error("getSignedPhotoUrl failed:", error);
    return null;
  }
  return data.signedUrl;
}
