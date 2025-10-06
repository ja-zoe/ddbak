import { NextRequest, NextResponse } from "next/server";
import { PostWebhook } from "@/lib/stripe-webhook";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  try {
    // Get raw body as required by Stripe
    const rawBody = await req.arrayBuffer();
    const buffer = Buffer.from(rawBody);

    // Pass raw buffer to your handler
    const result = await PostWebhook(buffer, sig);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const err = e as Error
    console.error("Stripe webhook error:", err.message);
    return new NextResponse(`Webhook handler error: ${err.message}`, { status: 400 });
  }
}
