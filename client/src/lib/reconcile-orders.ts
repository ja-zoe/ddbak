// lib/reconcile-orders.ts
import { stripe } from "./stripe";
import { fetchOrders, createOrderFromStripeSession } from "./requests";

export async function reconcileOrders() {
  console.log("Running order reconciliation...");

  // Fetch recent successful Stripe payments (last 24 hours)
  const sessions = await stripe.checkout.sessions.list({
    created: { gte: Math.floor(Date.now() / 1000) - 86400 }, // Last 24h
    status: "complete",
    limit: 100,
  });
  // Check each Stripe order against Payload
  for (const session of sessions.data) {
    try {
      // Check if order exists in Payload using the new fetchOrders
      const existingOrders = await fetchOrders({
        where: { stripeSessionId: { equals: session.id } },
        limit: 1
      });

      if (existingOrders.docs.length > 0) continue;

      //Create missing order
      console.log(`Creating missing order for session: ${session.id}`);
      await createOrderFromStripeSession(session);
    } catch (error) {
      console.error(`Failed to reconcile session ${session.id}:`, error);
    }
  }
}
