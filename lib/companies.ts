import crypto from "crypto";
import { getSupabase } from "./supabase";

export type Company = {
  id: string;
  name: string;
  lineChannelId: string | null;
  lineChannelSecret: string | null;
  lineChannelAccessToken: string | null;
  calendarId: string | null;
  dashboardUsername: string;
  dashboardPasswordHash: string;
  ownerLineUserId: string | null;
  ownerRegistrationCode: string | null;
  email: string | null;
  contactAddress: string | null;
  contactPhone: string | null;
  invoiceRegistrationNumber: string | null;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
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
    ownerLineUserId: data.owner_line_user_id,
    ownerRegistrationCode: data.owner_registration_code,
    email: data.email,
    contactAddress: data.contact_address,
    contactPhone: data.contact_phone,
    invoiceRegistrationNumber: data.invoice_registration_number,
    subscriptionStatus: data.subscription_status,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
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

export async function createPendingCompany(fields: {
  name: string;
  dashboardUsername: string;
  dashboardPasswordHash: string;
  email: string;
}): Promise<Company | null> {
  const { data, error } = await getSupabase()
    .from("companies")
    .insert({
      name: fields.name,
      dashboard_username: fields.dashboardUsername,
      dashboard_password_hash: fields.dashboardPasswordHash,
      email: fields.email,
      subscription_status: "pending",
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("createPendingCompany failed:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function getCompanyByStripeSubscriptionId(
  stripeSubscriptionId: string
): Promise<Company | null> {
  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();

  if (error) {
    console.error("getCompanyByStripeSubscriptionId failed:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function activateSubscription(
  companyId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("companies")
    .update({
      subscription_status: "active",
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
    })
    .eq("id", companyId);

  if (error) {
    console.error("activateSubscription failed:", error);
    return false;
  }
  return true;
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: string
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("companies")
    .update({ subscription_status: status })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  if (error) {
    console.error("updateSubscriptionStatus failed:", error);
    return false;
  }
  return true;
}

export async function updateLineIntegration(
  companyId: string,
  fields: {
    lineChannelId: string;
    lineChannelSecret: string;
    lineChannelAccessToken: string;
    calendarId: string;
  }
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("companies")
    .update({
      line_channel_id: fields.lineChannelId || null,
      line_channel_secret: fields.lineChannelSecret || null,
      line_channel_access_token: fields.lineChannelAccessToken || null,
      calendar_id: fields.calendarId || null,
    })
    .eq("id", companyId);

  if (error) {
    console.error("updateLineIntegration failed:", error);
    return false;
  }
  return true;
}

export async function generateOwnerRegistrationCode(companyId: string): Promise<string | null> {
  const code = crypto.randomInt(100000, 999999).toString();

  const { error } = await getSupabase()
    .from("companies")
    .update({ owner_registration_code: code })
    .eq("id", companyId);

  if (error) {
    console.error("generateOwnerRegistrationCode failed:", error);
    return null;
  }
  return code;
}

export async function confirmOwnerRegistration(companyId: string, lineUserId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("companies")
    .update({ owner_line_user_id: lineUserId, owner_registration_code: null })
    .eq("id", companyId);

  if (error) {
    console.error("confirmOwnerRegistration failed:", error);
  }
}

export async function updateDashboardPasswordHash(
  companyId: string,
  passwordHash: string
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("companies")
    .update({ dashboard_password_hash: passwordHash })
    .eq("id", companyId);

  if (error) {
    console.error("updateDashboardPasswordHash failed:", error);
    return false;
  }
  return true;
}

export async function updateCompanyEmail(companyId: string, email: string): Promise<boolean> {
  const { error } = await getSupabase().from("companies").update({ email }).eq("id", companyId);

  if (error) {
    console.error("updateCompanyEmail failed:", error);
    return false;
  }
  return true;
}

export async function updateCompanyProfile(
  companyId: string,
  contactAddress: string,
  contactPhone: string,
  invoiceRegistrationNumber: string
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("companies")
    .update({
      contact_address: contactAddress,
      contact_phone: contactPhone,
      invoice_registration_number: invoiceRegistrationNumber || null,
    })
    .eq("id", companyId);

  if (error) {
    console.error("updateCompanyProfile failed:", error);
    return false;
  }
  return true;
}

export async function setPasswordResetToken(
  companyId: string,
  token: string,
  expiresAt: string
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("companies")
    .update({ password_reset_token: token, password_reset_expires_at: expiresAt })
    .eq("id", companyId);

  if (error) {
    console.error("setPasswordResetToken failed:", error);
    return false;
  }
  return true;
}

export async function getCompanyByValidResetToken(token: string): Promise<Company | null> {
  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("password_reset_token", token)
    .gt("password_reset_expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("getCompanyByValidResetToken failed:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function resetPasswordWithToken(companyId: string, passwordHash: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from("companies")
    .update({
      dashboard_password_hash: passwordHash,
      password_reset_token: null,
      password_reset_expires_at: null,
    })
    .eq("id", companyId);

  if (error) {
    console.error("resetPasswordWithToken failed:", error);
    return false;
  }
  return true;
}
