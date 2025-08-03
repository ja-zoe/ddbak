"use server";

import { stripe } from "./stripe";
import { fetchProductFromId } from "./requests";
import { CartItem } from "@/contexts/CartProvider";

export async function createCheckoutSession(cart: CartItem[]) {
  const products = await Promise.all(
    cart.map(async (item) => {
      const product = await fetchProductFromId(item.id);
      return {
        product,
        quantity: item.quantity,
        color: item.color,
        otherVariants: item.otherVariants,
      };
    })
  );

  const line_items = products.map((item) => {
    const { product, quantity, color, otherVariants } = item;

    // Human-readable variant summary for name/description
    const variantSummary = [
      color ? `Color: ${color.name}` : null,
      otherVariants
        ? Object.entries(otherVariants)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
        : null,
    ]
      .filter(Boolean)
      .join(" | ");

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: [product.description, variantSummary]
            .filter(Boolean)
            .join(" – "),
          tax_code: "txcd_99999999",
          metadata: {
            productId: product.id.toString(),
            ...(color ? { color: `${color.name} (${color.hex})` } : {}),
            ...otherVariants,
          },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      success_url: `http://localhost:3001/shopping-cart`,
      cancel_url: `http://localhost:3001/shopping-cart`,
    });

    return session;
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    throw error;
  }
}
