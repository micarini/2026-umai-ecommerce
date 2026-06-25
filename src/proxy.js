import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getExpectedAdminSessionToken,
} from "@/lib/admin-auth";

function isMutatingMethod(method) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method);
}

function isProtectedApiPath(pathname) {
  return pathname.startsWith("/api/products") || pathname.startsWith("/api/categories");
}

function redirectToLogin(request) {
  const loginUrl = new URL("/admin/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const expectedSessionToken = await getExpectedAdminSessionToken().catch(() => null);
  const isAuthenticated = Boolean(sessionToken && expectedSessionToken && sessionToken === expectedSessionToken);

  if (pathname.startsWith("/dashboard")) {
    return isAuthenticated ? NextResponse.next() : redirectToLogin(request);
  }

  if (isProtectedApiPath(pathname) && isMutatingMethod(request.method)) {
    return isAuthenticated
      ? NextResponse.next()
      : NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/products/:path*", "/api/categories/:path*", "/admin/login", "/api/admin/:path*"],
};