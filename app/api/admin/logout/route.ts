import { withAdminApi } from "@/app/lib/admin-api";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";

async function handlePOST() {
  const session = await getAdminSession(false);
  session.destroy();
  return NextResponse.json({ ok: true });
}

export const POST = withAdminApi(handlePOST);
