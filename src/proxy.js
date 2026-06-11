import { NextResponse } from "next/server";

function isMutatingMethod(method) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method);
}

function isProtectedApiPath(pathname) {
  return pathname.startsWith("/api/products") || pathname.startsWith("/api/categories");
}

function isProtectedPath(pathname, method) {
  if (pathname.startsWith("/dashboard")) {
    return true;
  }

  return isProtectedApiPath(pathname) && isMutatingMethod(method);
}

function parseBasicAuth(authorizationHeader) {
  if (!authorizationHeader?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(authorizationHeader.slice(6));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Sushi Bowl Admin", charset="UTF-8"',
    },
  });
}

export function proxy(request) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const adminUser = process.env.ADMIN_DASHBOARD_USER;
  const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD;

  if (!adminUser || !adminPassword) {
    return unauthorized();
  }

  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname, request.method)) {
    return NextResponse.next();
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));

  if (
    !credentials ||
    credentials.username !== adminUser ||
    credentials.password !== adminPassword
  ) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/products/:path*", "/api/categories/:path*"],
};