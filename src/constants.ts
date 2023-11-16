export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

export const CLERK_USER_INFO_URL = process.env.CLERK_USER_INFO_URL;
export const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const GPT_URL = process.env.GPT_URL;

export const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

export const TRIAL_DAYS = process.env.TRIAL_DAYS
  ? parseInt(process.env.TRIAL_DAYS)
  : 7;
