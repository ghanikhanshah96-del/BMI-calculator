import { withAdminApi } from "@/app/lib/admin-api";
import { NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/auth";
import { listAdminReviews } from "@/app/lib/reviews-repo";

export const dynamic = "force-dynamic";

async function handleGET() {
  const gate = await requirePermission("reviews");
  if (!gate.ok)
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  try {
    return NextResponse.json(
      { reviews: await listAdminReviews() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Feedback could not be loaded. Please try again." },
      { status: 503 },
    );
  }
}

export const GET = withAdminApi(handleGET);
