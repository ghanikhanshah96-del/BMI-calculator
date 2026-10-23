import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import { redirect } from "next/navigation";
import { type AdminSessionData, getSessionOptions } from "@/app/lib/session";
import {
  ALL_ADMIN_PERMISSION_IDS,
  hasPermission,
  permissionForPath,
  type AdminPermissionId,
} from "@/app/lib/admin-permissions";
import {
  getAdminUserByEmail,
  getAdminUserById,
  normalizeEmail,
  verifyPassword,
} from "@/app/lib/admin-users";

export type { AdminSessionData };
export { getSessionOptions };

export async function getAdminSession(validateUser = true) {
  const session = await getIronSession<AdminSessionData>(
    await cookies(),
    getSessionOptions(),
  );
  if (validateUser && session.isLoggedIn && session.userId) {
    const user = await getAdminUserById(session.userId);
    if (!user || !user.active || session.version !== user.invitedAt) {
      session.isLoggedIn = false;
    } else {
      session.permissions = user.permissions;
      session.isSuperAdmin = false;
    }
  }
  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  return session;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function isEnvSuperAdmin(username: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  return safeEqual(username.trim(), expectedUser);
}

export function validateEnvAdminCredentials(
  username: string,
  password: string,
): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  if (!expectedPass) return false;
  return (
    safeEqual(username.trim(), expectedUser) &&
    safeEqual(password, expectedPass)
  );
}

/** @deprecated use validateEnvAdminCredentials or authenticateAdminLogin */
export function validateAdminCredentials(
  username: string,
  password: string,
): boolean {
  return validateEnvAdminCredentials(username, password);
}

export async function authenticateAdminLogin(
  username: string,
  password: string,
): Promise<{
  username: string;
  isSuperAdmin: boolean;
  permissions: AdminPermissionId[];
  userId?: string;
  version?: string;
} | null> {
  if (validateEnvAdminCredentials(username, password)) {
    return {
      username: username.trim(),
      isSuperAdmin: true,
      permissions: [...ALL_ADMIN_PERMISSION_IDS],
    };
  }

  const email = normalizeEmail(username);
  if (!email.includes("@")) return null;

  try {
    const user = await getAdminUserByEmail(email);
    if (!user || !user.active) return null;
    if (!verifyPassword(password, user.passwordHash)) return null;
    return {
      username: user.email,
      isSuperAdmin: false,
      permissions: user.permissions,
      userId: user.id,
      version: user.invitedAt,
    };
  } catch {
    return null;
  }
}

export function sessionIsSuperAdmin(session: {
  isSuperAdmin?: boolean;
  username?: string;
}): boolean {
  return session.isSuperAdmin === true;
}

export function sessionHasPermission(
  session: AdminSessionData,
  required: AdminPermissionId,
): boolean {
  return hasPermission(
    session.permissions,
    required,
    sessionIsSuperAdmin(session),
  );
}

export async function requirePermission(required: AdminPermissionId) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return { ok: false as const, status: 401 as const, session: null };
  }
  if (!sessionHasPermission(session, required)) {
    return { ok: false as const, status: 403 as const, session };
  }
  return { ok: true as const, status: 200 as const, session };
}

export async function requirePagePermission(pathname: string) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }
  const required = permissionForPath(pathname);
  if (required && !sessionHasPermission(session, required)) {
    const target = ALL_ADMIN_PERMISSION_IDS.find((id) =>
      sessionHasPermission(session, id),
    );
    redirect(
      target && target !== "dashboard"
        ? `/admin/${target}`
        : "/admin/login?denied=1",
    );
  }
  return session;
}
