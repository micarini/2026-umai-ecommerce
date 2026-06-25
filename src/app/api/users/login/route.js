import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sha256Hex } from "@/lib/hash";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const hashedPassword = await sha256Hex(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Login failed." },
      { status: 500 }
    );
  }
}
