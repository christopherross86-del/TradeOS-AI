import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlanById } from "@/lib/plans";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      // In development/mock mode, we might not have a signature
      console.warn("Stripe webhook received without signature or secret. Skipping verification for development.");
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    }
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
      const companyId = session.metadata?.companyId;
      const subscriptionId = session.subscription;
      const priceId = session.line_items?.data?.[0]?.price?.id || session.metadata?.priceId;

      if (!companyId) {
        console.error("Missing companyId in checkout session metadata");
        return new NextResponse("Missing companyId", { status: 400 });
      }

      // Sync plan in DB if it doesn't exist
      if (priceId) {
        const plan = getPlanById(priceId);
        if (plan) {
          await prisma.subscriptionPlan.upsert({
            where: { id: priceId },
            update: {
              name: plan.name,
              price: plan.price / 100,
              interval: plan.interval,
            },
            create: {
              id: priceId,
              name: plan.name,
              price: plan.price / 100,
              interval: plan.interval,
              features: plan.features.join(", "),
            },
          });
        }
      }

      await prisma.subscription.upsert({
        where: { id: subscriptionId || `sub_mock_${companyId}` },
        update: {
          status: "ACTIVE",
          planId: priceId,
        },
        create: {
          id: subscriptionId || `sub_mock_${companyId}`,
          companyId: companyId,
          planId: priceId,
          status: "ACTIVE",
        },
      });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: subscription.status.toUpperCase() as any,
          planId: subscription.items.data[0].price.id,
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "CANCELED",
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("Error processing Stripe webhook:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
