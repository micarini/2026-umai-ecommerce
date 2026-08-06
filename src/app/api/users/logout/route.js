import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { USER_SESSION_COOKIE, getSessionUserId } from "@/lib/user-auth";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST() {
  const sessionUserId = await getSessionUserId();

  if (sessionUserId) {
    await connectDB();
    await User.findByIdAndUpdate(sessionUserId, { sessionToken: null });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(USER_SESSION_COOKIE);
  return response;
}
