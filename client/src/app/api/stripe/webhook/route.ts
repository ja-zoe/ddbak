import { NextRequest, NextResponse } from "next/server";
import { PostWebhook } from "@/lib/stripe-webhook"; // or wherever your function is located

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  const rawBody = await req.arrayBuffer(); // Raw body required by Stripe for signature validation
  const bodyBuffer = Buffer.from(rawBody);

  try {
    const result = await PostWebhook(bodyBuffer, sig);
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Webhook handler error: ${error.message}`, { status: 400 });
  }
}
