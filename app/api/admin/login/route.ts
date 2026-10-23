import { withAdminApi } from "@/app/lib/admin-api";
import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminLogin, getAdminSession } from "@/app/lib/auth";

async function handlePOST(req: NextRequest) {
  try {
    if (
      !process.env.SESSION_SECRET ||
      process.env.SESSION_SECRET.length < 32 ||
      !process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        {
          error:
            "Admin setup required: configure ADMIN_PASSWORD and SESSION_SECRET",
        },
        { status: 503 },
      );
    }
    const body = await req.json().catch(() => null);
    if (
      !body ||
      typeof body.username !== "string" ||
      typeof body.password !== "string"
    )
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    const username = String(body.username || "");
    const password = String(body.password || "");

    const auth = await authenticateAdminLogin(username, password);
    if (!auth) {
      return NextResponse.json(
        { error: "Invalid email/username or password" },
        { status: 401 },
      );
    }

    const session = await getAdminSession(false);
    session.isLoggedIn = true;
    session.username = auth.username;
    session.isSuperAdmin = auth.isSuperAdmin;
    session.permissions = auth.permissions;
    session.userId = auth.userId;
    session.version = auth.version;
    await session.save();

    return NextResponse.json({
      ok: true,
      permissions: auth.permissions,
      isSuperAdmin: auth.isSuperAdmin,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export const POST = withAdminApi(handlePOST);
