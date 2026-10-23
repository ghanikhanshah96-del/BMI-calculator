import { withAdminApi } from "@/app/lib/admin-api";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/auth";
import {
  createAdminUser,
  generateTempPassword,
  listAdminUsers,
  normalizeEmail,
} from "@/app/lib/admin-users";
import { normalizePermissions } from "@/app/lib/admin-permissions";
import { sendAdminInviteEmail } from "@/app/lib/admin-invite-email";
import { formatEmailError } from "@/app/lib/email";

async function handleGET() {
  const gate = await requirePermission("users");
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  const users = await listAdminUsers();
  return NextResponse.json({ users });
}

async function handlePOST(req: NextRequest) {
  const gate = await requirePermission("users");
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  try {
    const body = await req.json();
    const email = normalizeEmail(String(body.email || ""));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    const permissions = normalizePermissions(body.permissions);
    if (permissions.length === 0) {
      return NextResponse.json(
        { error: "Select at least one access tab" },
        { status: 400 },
      );
    }

    const password = generateTempPassword(12);
    const user = await createAdminUser({
      email,
      permissions,
      passwordPlain: password,
    });

    try {
      await sendAdminInviteEmail({ email, password, permissions });
    } catch (e) {
      const detail = formatEmailError(e);
      console.error("Invite email failed:", detail, e);
      return NextResponse.json(
        {
          user,
          warning: `User was created, but the invite email could not be sent. ${detail} Use Reset password to resend after fixing SMTP.`,
          emailError: detail,
          tempPassword: password,
        },
        { status: 201 },
      );
    }

    return NextResponse.json({ user, emailed: true }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "USER_EXISTS") {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export const GET = withAdminApi(handleGET);
export const POST = withAdminApi(handlePOST);
