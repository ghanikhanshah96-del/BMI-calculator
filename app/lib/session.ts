import { randomBytes } from "node:crypto";
const unconfiguredSecret = randomBytes(32).toString("hex");
import type { SessionOptions } from "iron-session";
import type { AdminPermissionId } from "./admin-permissions";
export interface AdminSessionData {
  isLoggedIn?: boolean;
  username?: string;
  isSuperAdmin?: boolean;
  permissions?: AdminPermissionId[];
  userId?: string;
  version?: string;
}
export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET || unconfiguredSecret;
  if (!password || password.length < 32)
    throw new Error("Set SESSION_SECRET to at least 32 random characters");
  return {
    password,
    cookieName: "fcp_admin_session",
    ttl: 28800,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 28800,
    },
  };
}
