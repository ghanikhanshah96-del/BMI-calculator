import { withAdminApi } from "@/app/lib/admin-api";
import { NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/auth";
import { deleteReview, updateReview } from "@/app/lib/reviews-repo";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

async function handlePATCH(request: Request, context: Context) {
  const gate = await requirePermission("reviews");
  if (!gate.ok)
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  if (
    request.headers.get("origin") &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const { id } = await context.params;
  if (!/^[\w-]{1,128}$/.test(id))
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 4000)
      return NextResponse.json(
        { error: "Review is too long." },
        { status: 413 },
      );
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  }
  if (
    !body ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.trim().length > 40 ||
    typeof body.comment !== "string" ||
    !body.comment.trim() ||
    body.comment.trim().length > 280 ||
    !Number.isInteger(body.rating) ||
    body.rating < 1 ||
    body.rating > 5 ||
    typeof body.tool !== "string" ||
    body.tool.trim().length > 80 ||
    typeof body.published !== "boolean"
  ) {
    return NextResponse.json(
      {
        error:
          "Enter a name, a 1–5 star rating, and feedback up to 280 characters.",
      },
      { status: 400 },
    );
  }
  if (body.published && body.rating <= 3)
    return NextResponse.json(
      { error: "Reviews of 3 stars or below must stay private." },
      { status: 400 },
    );
  try {
    const updated = await updateReview(
      id,
      {
        name: body.name.trim(),
        comment: body.comment.trim(),
        rating: body.rating,
        tool: body.tool.trim(),
        published: body.published,
      },
      gate.session.username || "Admin",
    );
    if (!updated)
      return NextResponse.json(
        { error: "This review no longer exists. Refresh the list." },
        { status: 404 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Review could not be saved. Try again." },
      { status: 503 },
    );
  }
}

async function handleDELETE(request: Request, context: Context) {
  const gate = await requirePermission("reviews");
  if (!gate.ok)
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  if (
    request.headers.get("origin") &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const { id } = await context.params;
  if (!/^[\w-]{1,128}$/.test(id))
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  try {
    if (!(await deleteReview(id)))
      return NextResponse.json(
        { error: "This review no longer exists. Refresh the list." },
        { status: 404 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Review could not be deleted. Try again." },
      { status: 503 },
    );
  }
}

export const PATCH = withAdminApi(handlePATCH);
export const DELETE = withAdminApi(handleDELETE);
