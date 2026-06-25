import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username = "", password = "" } = body ?? {};

    if (
      username !== process.env.ADMIN_DASHBOARD_USER ||
      password !== process.env.ADMIN_DASHBOARD_PASSWORD
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const sessionToken = await createAdminSessionToken(username, password);
    const response = NextResponse.json({ ok: true });

    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message || "Login failed." },
      { status: 400 }
    );
  }
}
