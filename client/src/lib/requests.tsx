"use server";
import type { ProductCategory, Product, Media } from "@payload";
import { getPayloadAPIKey, getServerURL } from "./utils";
import type { Collections } from "./payload-types";

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
  return await fetchFromServer<ProductCategory>("product-categories");
}

export async function fetchProducts() {
  return await fetchFromServer<Product>("products");
}

export async function fetchImageFromId(id: number) {
  return await fetchFromServer<Media>("media", id);
}

export async function fetchProductCategoryFromId(id: number) {
  return await fetchFromServer<ProductCategory>("product-categories", id);
}

export async function fetchProductFromId(id: number) {
  return await fetchFromServer<Product>("products", id);
}
