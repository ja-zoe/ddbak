"use server";
import type { ProductCategory, Product, Media } from "@payload";
import { getPayloadAPIKey, getServerURL } from "./utils";
import type { Collections } from "./payload-types";
import { stringify } from "qs-esm";
import { stripe } from "./stripe";
import type Stripe from "stripe";

const serverURL = getServerURL();
const payloadApiKey = getPayloadAPIKey();

interface ResponseType<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: any;
  page: number;
  pagingCounter: number;
  prevPage: any;
  totalDocs: number;
  totalPages: number;
}

class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public endpoint: string
  ) {
    super(
      `API request to ${endpoint} failed with status ${status}: ${statusText}`
    );
    this.name = "APIError";
  }
}

async function fetchFromServer<T>(
  endpoint: Collections
): Promise<ResponseType<T>>;
async function fetchFromServer<T>(
  endpoint: Collections,
  id: number
): Promise<T>;
async function fetchFromServer<T>(
  endpoint: Collections,
  id?: number
): Promise<ResponseType<T> | T> {
  const url = id
    ? `${serverURL}/api/${endpoint}/${id}`
    : `${serverURL}/api/${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `users API-Key ${payloadApiKey}`,
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, response.statusText, endpoint);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
}

export async function fetchProductCategories() {
  try {
    return await fetchFromServer<ProductCategory>("product-categories");
  } catch (error) {
    console.error(`Failed to fetch product categories:`, error);
    throw error;
  }
}

export async function fetchProducts() {
  try {
    return await fetchFromServer<Product>("products");
  } catch (error) {
    console.error(`Failed to fetch products:`, error);
    throw error;
  }
}

export async function fetchImageFromId(id: number) {
  try {
    return await fetchFromServer<Media>("media", id);
  } catch (error) {
    console.error(`Failed to fetch image from id:`, error);
    throw error;
  }
}

export async function fetchProductCategoryFromId(id: number) {
  try {
    return await fetchFromServer<ProductCategory>("product-categories", id);
  } catch (error) {
    console.error(`Failed to fetch product category from id:`, error);
    throw error;
  }
}

export async function fetchProductFromId(id: number) {
  try {
    return await fetchFromServer<Product>("products", id);
  } catch (error) {
    console.error(`Failed to fetch product from id:`, error);
    throw error;
  }
}

export async function createOrder(orderData: any) {
  const url = `${serverURL}/api/orders`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `users API-Key ${payloadApiKey}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new APIError(response.status, response.statusText, "orders");
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
}

export async function fetchOrders(params?: {
  where?: Record<string, any>;
  limit?: number;
}): Promise<ResponseType<{ id: string; stripeSessionId: string }>> {
  const url = `${serverURL}/api/orders`;

  // Construct query parameters using qs-esm exactly as Payload recommends
  const query = {
    where: params?.where || {},
    limit: params?.limit || 10, // default limit
  };

  const stringifiedQuery = stringify(query, { addQueryPrefix: true });

  try {
    const response = await fetch(url + stringifiedQuery, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `users API-Key ${payloadApiKey}`,
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, response.statusText, "orders");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Failed to fetch orders:`, error);
    throw error;
  }
}

export async function createOrderFromStripeSession(
  session: Stripe.Checkout.Session
) {
  // 1. Fetch line items with product details
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"], // Get full product details
  });

  // 2. Transform line items to Payload order items format
  const items = lineItems.data.map((item) => {
    const product = item.price?.product as Stripe.Product;
    const metadata = product?.metadata || {};

    // Validate required product ID
    if (!metadata.productId) {
      throw new Error(`Product ${product.id} is missing productId metadata`);
    }

    return {
      product: parseInt(metadata.productId),
      quantity: item.quantity || 1,
      unitPrice: (item.amount_total ?? 0) / (item.quantity || 1),
      selectedColor: metadata.color
        ? {
            name: metadata.colorName || metadata.color,
            hex: metadata.colorHex || null,
          }
        : null,
      selectedVariants: Object.entries(metadata)
        .filter(
          ([key]) =>
            !["productId", "color", "colorName", "colorHex"].includes(key)
        )
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, unknown>),
    };
  });

  // 3. Prepare shipping address
  const address = session.collected_information?.shipping_details?.address;
  const shippingAddress = address
    ? {
        line1: address.line1,
        line2: address.line2 || undefined, // Optional field
        city: address.city,
        state: address.state || undefined, // Optional field
        postal_code: address.postal_code,
        country: address.country,
      }
    : undefined;

  // 4. Build complete order data
  const orderData = {
    customerEmail: session.customer_details?.email ?? "",
    shippingAddress,
    items,
    status: "unfulfilled",
    stripeSessionId: session.id,
    totalAmount: session.amount_total || 0,
  };

  // 5. Create order in Payload
  try {
    const createdOrder = await createOrder(orderData);
    console.log(
      `Successfully created order ${createdOrder.id} for session ${session.id}`
    );
    return createdOrder;
  } catch (error) {
    console.error(`Failed to create order for session ${session.id}:`, error);
    throw error;
  }
}
