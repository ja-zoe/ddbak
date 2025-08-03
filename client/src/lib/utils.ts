import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getServerURL(): string {
  const serverURL = process.env.SERVER_URL;
  if (!serverURL || serverURL.length < 1) {
    throw new Error("SERVER_URL environment variable not set");
  }
  return serverURL;
}

export function getPayloadAPIKey(): string {
  const apiKey = process.env.PAYLOAD_API_KEY;
  if (!apiKey || apiKey.length < 1) {
    throw new Error("SERVER_URL environment variable not set");
  }
  return apiKey;
}

export function getStripeKey(): string {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey || apiKey.length < 1) {
    throw new Error("STRIPE_SECRET_KEY environment variable not set");
  }
  return apiKey;
}