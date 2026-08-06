import { cookies } from "next/headers";

import { sha256Hex } from "@/lib/hash";

export const ADMIN_SESSION_COOKIE = "sushi-admin-session";

function ensureAdminConfig() {
  const adminUser = process.env.ADMIN_DASHBOARD_USER;
  const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD;

  if (!adminUser || !adminPassword) {
    throw new Error("Missing admin dashboard credentials.");
  }

  return { adminUser, adminPassword };
}

export async function createAdminSessionToken(username, password) {
  return sha256Hex(`${username}:${password}`);
}

export async function getExpectedAdminSessionToken() {
  const { adminUser, adminPassword } = ensureAdminConfig();
  return createAdminSessionToken(adminUser, adminPassword);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const expectedSessionToken = await getExpectedAdminSessionToken().catch(() => null);
  return Boolean(sessionToken && expectedSessionToken && sessionToken === expectedSessionToken);
}
