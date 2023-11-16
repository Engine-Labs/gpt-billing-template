export const CLERK_USER_INFO_URL = process.env.CLERK_USER_INFO_URL;
export const CLERK_ENDPOINT_SECRET = process.env.CLERK_ENDPOINT_SECRET;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
export const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;

export const GPT_URL =
  process.env.GPT_URL ||
  "https://chat.openai.com/g/g-A3ueeULl8-database-admin";

export const TRIAL_DAYS = process.env.TRIAL_DAYS
  ? parseInt(process.env.TRIAL_DAYS)
  : 7;
