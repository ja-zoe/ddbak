"use server";

import { stripe } from "./stripe";
import type Stripe from "stripe";
import { createOrder } from "./requests";
import { reconcileOrders } from "./reconcile-orders";

export async function PostWebhook(rawBody: Buffer, sig: string) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      'whsec_f5f1c490fe360599ec65aef9d64836451e658b326db48334845de2dd320a63e9'
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
        product: parseInt(metadata.productId), // This must match your Payload Product ID
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

    const address = session.collected_information?.shipping_details?.address
    const orderData = {
      customerEmail: session.customer_details?.email ?? "",
      shippingAddress: {
        "line1": address?.line1,
        "line2": address?.line2,
        "city": address?.city,
        "state": address?.state,
        "postal_code": address?.postal_code,
        "country": address?.country
      },
      items,
      status: "unfulfilled",
      stripeSessionId: session.id,
      totalAmount: session.amount_total,
    };

    try {
      reconcileOrders()
      await createOrder(orderData)

      return { success: true };
    } catch (error) {
      console.error("Payload API error:", error);
      return { success: false }
    }
  }

  return { success: false, reason: "Unhandled event type" };
}
