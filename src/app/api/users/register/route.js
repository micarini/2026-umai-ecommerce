import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sha256Hex } from "@/lib/hash";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await sha256Hex(password);
    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json(
      {
        user: { _id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Registration failed." },
      { status: 500 }
    );
  }
}
