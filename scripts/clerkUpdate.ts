import "dotenv/config";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { readFile, readFileSync, writeFileSync } from "fs";

const clerkApiKey = process.env.CLERK_SECRET_KEY;
const oauthAppName = process.env.OAUTH_APP_NAME || "gpt-clerk-oauth-app";

type ClerkOauthUpdateResponse = {
  object: string;
  id: string;
  instance_id: string;
  name: string;
  client_id: string;
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

async function updateClerkOauthApp(callbackUrl: string): Promise<void> {
  const OauthData = readFileSync("./clerk-oauth-app.json", "utf8");
  const { id } = JSON.parse(OauthData);
  const url = `/oauth_applications/${id}`;
  const requestData = {
    callback_url: callbackUrl,
  };
  const response = await clerkAxios.patch<ClerkOauthUpdateResponse>(
    url,
    requestData,
    config
  );
  writeFileSync("./clerk-oauth-app.json", JSON.stringify(response.data));
  console.log(`Clerk OAuth Callback URL updated ${response.data.id}`);
}

async function main() {
  const args = process.argv;
  const callbackUrl = args[2]; // args[0] is node, args[1] is the script path

  if (callbackUrl) {
    await updateClerkOauthApp(callbackUrl);
  } else {
    console.log("No argument provided");
  }
}

main();
