import "dotenv/config";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { writeFileSync } from "fs";

const clerkApiKey = process.env.CLERK_SECRET_KEY;
const oauthAppName = "gpt-clerk-oauth-app";

type ClerkOauthCreateResponse = {
  object: string;
  id: string;
  instance_id: string;
  name: string;
  client_id: string;
  client_secret: string;
  public: boolean;
  scopes: string;
  callback_url: string;
  authorize_url: string;
  token_fetch_url: string;
  user_info_url: string;
  created_at: number;
  updated_at: number;
};

const config: AxiosRequestConfig = {
  headers: {
    contentType: "application/json",
    Authorization: `Bearer ${clerkApiKey}`,
  },
};

const clerkAxios = axios.create({
  baseURL: "https://api.clerk.com/v1",
});

async function createClerkOauthApp(): Promise<void> {
  const url = `/oauth_applications`;
  const requestData = {
    callback_url: "https://example.com/oauth2/callback",
    name: oauthAppName,
  };
  const response = await clerkAxios.post<ClerkOauthCreateResponse>(
    url,
    requestData,
    config
  );
  writeFileSync("./clerk-oauth-app.json", JSON.stringify(response.data));
  console.log(`Clerk OAuth App created ${response.data.id}`);
}

createClerkOauthApp();
