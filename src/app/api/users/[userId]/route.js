import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { isOwnSession } from "@/lib/user-auth";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    if (!(await isOwnSession(userId))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select("-password -sessionToken");
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to get user." },
      { status: 500 }
    );
  }
}
