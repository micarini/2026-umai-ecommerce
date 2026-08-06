import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const USER_SESSION_COOKIE = "honu-user-session";

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;

  await connectDB();
  const user = await User.findOne({ sessionToken: token }).select("_id").lean();
  return user ? user._id.toString() : null;
}

export async function isOwnSession(userId) {
  const sessionUserId = await getSessionUserId();
  return Boolean(sessionUserId) && sessionUserId === userId;
}
