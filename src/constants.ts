export const CRYPTO_KEY = process.env.CRYPTO_KEY || "SAMPLE_KEY";
export const SUPABASE_ORG_ID = process.env.SUPABASE_ORG_ID;
export const CLERK_USER_INFO_URL = process.env.CLERK_USER_INFO_URL;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

export const DBA_GPT_URL =
  process.env.DBA_GPT_URL ||
  "https://chat.openai.com/g/g-A3ueeULl8-database-admin";

export const TRIAL_DAYS = process.env.TRIAL_DAYS
  ? parseInt(process.env.TRIAL_DAYS)
  : 7;

