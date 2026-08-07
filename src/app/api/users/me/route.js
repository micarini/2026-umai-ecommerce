import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getSessionUserId } from "@/lib/user-auth";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionUserId = await getSessionUserId();

  if (!sessionUserId) {
    return NextResponse.json({ user: null });
  }

  await connectDB();
  const user = await User.findById(sessionUserId).select("_id name email").lean();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: { _id: user._id.toString(), name: user.name, email: user.email },
  });
}
