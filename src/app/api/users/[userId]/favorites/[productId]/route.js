import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { isOwnSession } from "@/lib/user-auth";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  try {
    const { userId, productId } = await params;

    if (!(await isOwnSession(userId))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await User.findByIdAndUpdate(userId, {
      $pull: { favorites: productId },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to remove favorite." },
      { status: 500 }
    );
  }
}
