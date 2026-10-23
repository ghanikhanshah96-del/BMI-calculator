import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { getDb } from "@/app/lib/firebase-admin";
import {
  normalizePermissions,
  type AdminPermissionId,
} from "@/app/lib/admin-permissions";

export const ADMIN_USERS_COLLECTION = "adminUsers";

export type AdminUserRecord = {
  id: string;
  email: string;
  permissions: AdminPermissionId[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  invitedAt?: string;
};

function collection() {
  return getDb().collection(ADMIN_USERS_COLLECTION);
}

function toIso(value: unknown, fallback = new Date().toISOString()): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return fallback;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const verify = scryptSync(password, salt, 64);
  const hashBuf = Buffer.from(hash, "hex");
  if (hashBuf.length !== verify.length) return false;
  return timingSafeEqual(hashBuf, verify);
}

export function generateTempPassword(length = 12): string {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}

function docToUser(
  snap: QueryDocumentSnapshot | { id: string; data: () => DocumentData },
): AdminUserRecord & { passwordHash: string } {
  const data = snap.data();
  return {
    id: snap.id,
    email: String(data.email || "").toLowerCase(),
    permissions: normalizePermissions(data.permissions),
    active: data.active !== false,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    invitedAt: data.invitedAt ? String(data.invitedAt) : undefined,
    passwordHash: String(data.passwordHash || ""),
  };
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  let snap;
  try {
    snap = await collection().orderBy("createdAt", "desc").get();
  } catch {
    snap = await collection().get();
  }
  const users = snap.docs.map((d) => {
    const full = docToUser(d);
    const { passwordHash: _pw, ...user } = full;
    return user;
  });
  return users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAdminUserByEmail(
  email: string,
): Promise<(AdminUserRecord & { passwordHash: string }) | null> {
  const normalized = normalizeEmail(email);
  const snap = await collection()
    .where("email", "==", normalized)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return docToUser(snap.docs[0]!);
}

export async function getAdminUserById(
  id: string,
): Promise<(AdminUserRecord & { passwordHash: string }) | null> {
  const snap = await collection().doc(id).get();
  if (!snap.exists) return null;
  return docToUser(snap as QueryDocumentSnapshot);
}

export async function createAdminUser(input: {
  email: string;
  permissions: AdminPermissionId[];
  passwordPlain: string;
}): Promise<AdminUserRecord> {
  const email = normalizeEmail(input.email);
  const existing = await getAdminUserByEmail(email);
  if (existing) {
    throw new Error("USER_EXISTS");
  }

  const now = new Date().toISOString();
  const ref = collection().doc();
  const data = {
    email,
    permissions: input.permissions,
    passwordHash: hashPassword(input.passwordPlain),
    active: true,
    createdAt: now,
    updatedAt: now,
    invitedAt: now,
  };
  await ref.set(data);
  return {
    id: ref.id,
    email,
    permissions: input.permissions,
    active: true,
    createdAt: now,
    updatedAt: now,
    invitedAt: now,
  };
}

export async function updateAdminUserPermissions(
  id: string,
  permissions: AdminPermissionId[],
): Promise<AdminUserRecord | null> {
  const existing = await getAdminUserById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  await collection().doc(id).set(
    {
      permissions,
      updatedAt: now,
    },
    { merge: true },
  );
  const { passwordHash: _, ...user } = existing;
  return { ...user, permissions, updatedAt: now };
}

export async function resetAdminUserPassword(
  id: string,
  passwordPlain: string,
): Promise<AdminUserRecord | null> {
  const existing = await getAdminUserById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  await collection()
    .doc(id)
    .set(
      {
        passwordHash: hashPassword(passwordPlain),
        updatedAt: now,
        invitedAt: now,
      },
      { merge: true },
    );
  const { passwordHash: _, ...user } = existing;
  return { ...user, updatedAt: now, invitedAt: now };
}

export async function deleteAdminUser(id: string): Promise<void> {
  await collection().doc(id).delete();
}
