import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { isOwnSession } from "@/lib/user-auth";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const { userId } = await params;

    if (!(await isOwnSession(userId))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productIds } = await request.json();
    if (!Array.isArray(productIds)) {
      return NextResponse.json({ message: "productIds must be an array." }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(userId, {
      $set: { favorites: [...new Set(productIds)] },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to sync favorites." },
      { status: 500 }
    );
  }
}
