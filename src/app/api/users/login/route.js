import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { generateSessionToken, sha256Hex } from "@/lib/hash";
import { USER_SESSION_COOKIE } from "@/lib/user-auth";
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

    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;
    await user.save();

    const response = NextResponse.json({
      user: { _id: user._id, name: user.name, email: user.email },
    });

    response.cookies.set(USER_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Login failed." },
      { status: 500 }
    );
  }
}
