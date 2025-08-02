"use server";

import { stripe } from "./stripe";
import type Stripe from "stripe";

export async function PostWebhook(rawBody: Buffer, sig: string) {
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
      expand: ["data.price.product"], // This makes `item.price.product` available
    });

    const items = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product;
      const metadata = product?.metadata || {};

      return {
        product: metadata.productId || null, // This must match your Payload Product ID
        selectedColor: metadata.color
          ? {
            name: metadata.colorName || metadata.color,
            hex: metadata.colorHex || null,
          }
          : null,
        selectedVariants: Object.entries(metadata)
          .filter(([key]) => !["productId", "color", "colorName", "colorHex"].includes(key))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {} as Record<string, unknown>),
        quantity: item.quantity || 1,
        unitPrice: (item.amount_total ?? 0) / (item.quantity || 1),
      };
    });

    const orderData = {
      customerEmail: session.customer_details?.email ?? "",
      shippingAddress: session.collected_information?.shipping_details || null,
      items,
      status: "unfulfilled",
      stripeSessionId: session.id,
      totalAmount: session.amount_total,
    };

    const res = await fetch("http://localhost:3000/api/collections/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYLOAD_API_KEY}`,
      },
      body: JSON.stringify({ data: orderData }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Payload API error:", text);
      throw new Error(`Failed to create order in Payload: ${text}`);
    }

    return { success: true };
  }

  return { success: false, reason: "Unhandled event type" };
}
