import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Secured cache invalidation for blog publish/edit/unpublish/delete.
 * Admin calls this with REVALIDATE_SECRET after mutations.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return NextResponse.json({ error: "Revalidation not configured" }, { status: 503 });
  }

  const header = req.headers.get("x-revalidate-secret") || "";
  const body = (await req.json().catch(() => ({}))) as {
    secret?: string;
    slug?: string;
  };
  const provided = header || body.secret || "";
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-page");
  revalidateTag("blog", "max");

  if (body.slug && typeof body.slug === "string") {
    const slug = body.slug.replace(/[^a-z0-9-]/gi, "");
    if (slug) revalidatePath(`/blog/${slug}`);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
