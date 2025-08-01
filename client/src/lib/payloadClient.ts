// lib/payloadInit.ts

import payload from "payload";
import path from "path";

let initialized = false;

export async function initPayload() {
  if (initialized) return;

  const configPath = path.resolve(process.cwd(), "payload.config.ts");

  // You might need to import your config with dynamic import for ES modules:
  // const { default: config } = await import(configPath);
  // But require usually works in Node.js environment:
  const config = require(configPath).default ?? require(configPath);

  await payload.init({
    config,
    // Optional flags you may want:
    // cron: false,
    // disableDBConnect: false,
  });

  initialized = true;
}
