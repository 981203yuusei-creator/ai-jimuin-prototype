import { getSupabase } from "./supabase";
import { getStripe } from "./stripe";
import { getCompanyById } from "./companies";

const CONFIRM_AFTER_PAID_INVOICES = 3;
const MAX_REFERRAL_TIERS = 5;

const TIER_COUPON_IDS: Record<number, string> = {
  1: "lpEiMBL0",
  2: "SdtfbktA",
  3: "eVzhaOFj",
  4: "C0hyIJ8c",
  5: "VwvPEbu6",
};

// 紹介された側: 月¥1,000引き×3ヶ月のクーポン
export const REFERRED_DISCOUNT_COUPON_ID = "44Csb5nf";

export async function createReferral(referrerCompanyId: string, referredCompanyId: string): Promise<void> {
  const { error } = await getSupabase().from("referrals").insert({
    referrer_company_id: referrerCompanyId,
    referred_company_id: referredCompanyId,
  });
  if (error) {
    console.error("createReferral failed:", error);
  }
}

async function getPendingReferralByReferredCompany(referredCompanyId: string): Promise<{
  id: string;
  referrer_company_id: string;
  paid_invoice_count: number;
} | null> {
  const { data, error } = await getSupabase()
    .from("referrals")
    .select("id, referrer_company_id, paid_invoice_count")
    .eq("referred_company_id", referredCompanyId)
    .eq("status", "pending")
    .maybeSingle();

  if (error) {
    console.error("getPendingReferralByReferredCompany failed:", error);
    return null;
  }
  return data;
}

export async function invalidatePendingReferral(referredCompanyId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("referrals")
    .update({ status: "invalid" })
    .eq("referred_company_id", referredCompanyId)
    .eq("status", "pending");

  if (error) {
    console.error("invalidatePendingReferral failed:", error);
  }
}

async function countConfirmedReferrals(referrerCompanyId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from("referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_company_id", referrerCompanyId)
    .eq("status", "confirmed");

  if (error) {
    console.error("countConfirmedReferrals failed:", error);
    return 0;
  }
  return count ?? 0;
}

async function applyReferrerDiscount(referrerCompanyId: string): Promise<void> {
  const confirmedCount = await countConfirmedReferrals(referrerCompanyId);
  const tier = Math.min(confirmedCount, MAX_REFERRAL_TIERS);
  if (tier < 1) return;

  const referrer = await getCompanyById(referrerCompanyId);
  if (!referrer?.stripeSubscriptionId) return;

  try {
    await getStripe().subscriptions.update(referrer.stripeSubscriptionId, {
      discounts: [{ coupon: TIER_COUPON_IDS[tier] }],
    });
  } catch (err) {
    console.error("applyReferrerDiscount failed:", err);
  }
}

export async function handleReferredInvoicePaid(referredCompanyId: string): Promise<void> {
  const referral = await getPendingReferralByReferredCompany(referredCompanyId);
  if (!referral) return;

  const nextCount = referral.paid_invoice_count + 1;

  if (nextCount >= CONFIRM_AFTER_PAID_INVOICES) {
    const { error } = await getSupabase()
      .from("referrals")
      .update({
        paid_invoice_count: nextCount,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", referral.id);

    if (error) {
      console.error("handleReferredInvoicePaid (confirm) failed:", error);
      return;
    }
    await applyReferrerDiscount(referral.referrer_company_id);
  } else {
    const { error } = await getSupabase()
      .from("referrals")
      .update({ paid_invoice_count: nextCount })
      .eq("id", referral.id);

    if (error) {
      console.error("handleReferredInvoicePaid (increment) failed:", error);
    }
  }
}

export async function getConfirmedReferralCount(companyId: string): Promise<number> {
  return countConfirmedReferrals(companyId);
}
