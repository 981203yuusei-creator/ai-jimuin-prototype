import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe";
import {
  activateSubscription,
  updateSubscriptionStatus,
  getCompanyByStripeSubscriptionId,
} from "../../../../lib/companies";
import { handleReferredInvoicePaid, invalidatePendingReferral } from "../../../../lib/referrals";
import { notifyOwner } from "../../../../lib/notify";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.metadata?.companyId ?? session.client_reference_id;
        const customerId = session.customer as string | null;
        const subscriptionId = session.subscription as string | null;
        if (companyId && customerId && subscriptionId) {
          const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
          await activateSubscription(companyId, customerId, subscriptionId, subscription.status);
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(subscription.id, subscription.status);

        if (subscription.status === "past_due" || subscription.status === "unpaid") {
          const company = await getCompanyByStripeSubscriptionId(subscription.id);
          if (company) {
            await notifyOwner(
              company,
              [
                "【お支払いエラー】",
                "ご登録のクレジットカードでの決済に失敗しました。",
                "このままだとジムアシのご利用が停止されます。",
                "お手数ですが、ダッシュボードからお支払い方法をご確認・更新してください。",
              ].join("\n")
            );
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(subscription.id, "canceled");
        const company = await getCompanyByStripeSubscriptionId(subscription.id);
        if (company) {
          await invalidatePendingReferral(company.id);
        }
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionRef = invoice.parent?.subscription_details?.subscription;
        const subscriptionId = typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef?.id ?? null;
        if (subscriptionId) {
          const company = await getCompanyByStripeSubscriptionId(subscriptionId);
          if (company) {
            await handleReferredInvoicePaid(company.id);
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error("Stripe webhook processing failed:", err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
