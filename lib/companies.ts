import { getSupabase } from "./supabase";

export type Company = {
  id: string;
  name: string;
  lineChannelId: string;
  lineChannelSecret: string;
  lineChannelAccessToken: string;
  calendarId: string | null;
  dashboardUsername: string;
  dashboardPasswordHash: string;
};

function mapRow(data: any): Company {
  return {
    id: data.id,
    name: data.name,
    lineChannelId: data.line_channel_id,
    lineChannelSecret: data.line_channel_secret,
    lineChannelAccessToken: data.line_channel_access_token,
    calendarId: data.calendar_id,
    dashboardUsername: data.dashboard_username,
    dashboardPasswordHash: data.dashboard_password_hash,
  };
}

export async function getCompanyByLineDestination(destination: string): Promise<Company | null> {
  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("line_channel_id", destination)
    .maybeSingle();

  if (error) {
    console.error("getCompanyByLineDestination failed:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function getCompanyByDashboardUsername(username: string): Promise<Company | null> {
  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("dashboard_username", username)
    .maybeSingle();

  if (error) {
    console.error("getCompanyByDashboardUsername failed:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getCompanyById failed:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}
