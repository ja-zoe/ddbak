"use server";

import { stripe } from "./stripe";
import type Stripe from "stripe";
import payload from "payload"; // Import payload here
import { initPayload } from "./payloadClient";

/**
 * Handles the checkout.session.completed event from Stripe
 * @param rawBody - the raw request body as a Buffer
 * @param sig - the Stripe signature from the request header
 */
export async function PostWebhook(rawBody: Buffer, sig: string) {
  await initPayload(); // Ensure Payload is initialized before use

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const items = lineItems.data.map((item) => ({
      productId: item.id ?? "",
      productName: item.description,
      quantity: item.quantity || 1,
      unitAmount: (item.amount_total ?? 0) / (item.quantity || 1),
    }));

    await payload.create({
      collection: "orders",
      data: {
        customerEmail: session.customer_details?.email ?? "",
        shippingAddress: session.collected_information?.shipping_details,
        items,
        status: "unfulfilled",
        stripeSessionId: session.id,
        totalAmount: session.amount_total,
      },
    });

    return { success: true };
  }

  return { success: false, reason: "Unhandled event type" };
}
