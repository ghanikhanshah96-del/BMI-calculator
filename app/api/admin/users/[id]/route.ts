import { withAdminApi } from "@/app/lib/admin-api";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/auth";
import {
  deleteAdminUser,
  generateTempPassword,
  getAdminUserById,
  resetAdminUserPassword,
  updateAdminUserPermissions,
} from "@/app/lib/admin-users";
import { normalizePermissions } from "@/app/lib/admin-permissions";
import { sendAdminInviteEmail } from "@/app/lib/admin-invite-email";
import { formatEmailError } from "@/app/lib/email";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function handlePUT(req: NextRequest, context: RouteContext) {
  const gate = await requirePermission("users");
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  const { id } = await context.params;
  try {
    const body = await req.json();
    const action = String(body.action || "updatePermissions");

    if (!["resetPassword", "updatePermissions"].includes(action))
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    if (action === "resetPassword") {
      const existing = await getAdminUserById(id);
      if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const password = generateTempPassword(12);
      const user = await resetAdminUserPassword(id, password);
      try {
        await sendAdminInviteEmail({
          email: existing.email,
          password,
          permissions: existing.permissions,
        });
        return NextResponse.json({ user, emailed: true });
      } catch (e) {
        const detail = formatEmailError(e);
        console.error("Reset email failed:", detail, e);
        return NextResponse.json({
          user,
          warning: `Password reset, but email could not be sent. ${detail}`,
          emailError: detail,
          tempPassword: password,
        });
      }
    }

    const permissions = normalizePermissions(body.permissions);
    if (permissions.length === 0) {
      return NextResponse.json(
        { error: "Select at least one access tab" },
        { status: 400 },
      );
    }
    const user = await updateAdminUserPermissions(id, permissions);
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

async function handleDELETE(_req: NextRequest, context: RouteContext) {
  const gate = await requirePermission("users");
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  const { id } = await context.params;
  try {
    await deleteAdminUser(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export const PUT = withAdminApi(handlePUT);
export const DELETE = withAdminApi(handleDELETE);
