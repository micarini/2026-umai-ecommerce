import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const { productIds } = await request.json();
    if (!Array.isArray(productIds)) {
      return NextResponse.json({ message: "productIds must be an array." }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(params.userId, {
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
