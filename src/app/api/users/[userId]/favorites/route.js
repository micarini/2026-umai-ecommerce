import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await User.findById(params.userId).populate("favorites");
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ favorites: user.favorites });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to get favorites." },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ message: "productId is required." }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(params.userId, {
      $addToSet: { favorites: productId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to add favorite." },
      { status: 500 }
    );
  }
}
