import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe";
import {
  activateSubscription,
  updateSubscriptionStatus,
} from "../../../../lib/companies";

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
          await activateSubscription(companyId, customerId, subscriptionId);
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(subscription.id, subscription.status);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(subscription.id, "canceled");
        break;
      }
    }
  } catch (err) {
    console.error("Stripe webhook processing failed:", err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
