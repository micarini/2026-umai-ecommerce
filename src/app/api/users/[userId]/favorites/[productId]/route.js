import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await User.findByIdAndUpdate(params.userId, {
      $pull: { favorites: params.productId },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to remove favorite." },
      { status: 500 }
    );
  }
}
