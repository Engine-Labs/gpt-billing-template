import prisma from "../../prisma";
import axios from "axios";
import { CLERK_USER_INFO_URL } from "../../constants";
import { getTrialDaysRemaining } from "../../actions/billing";

export async function getUserInfo(token: string) {
  if (!CLERK_USER_INFO_URL) {
    throw new Error("Missing CLERK_USER_INFO_URL");
  }
  const response = await axios.get(CLERK_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function getUserFromToken(token: string) {
  const userInfo = await getUserInfo(token);

  return await prisma.user.findUnique({
    where: {
      clerk_id: userInfo.user_id,
    },
  });
}

export async function canMakeApiCall(token: string): Promise<boolean> {
  const user = await getUserFromToken(token);
  if (!user) return false;

  return user.subscribed || (await getTrialDaysRemaining(user)) > 0;
}
