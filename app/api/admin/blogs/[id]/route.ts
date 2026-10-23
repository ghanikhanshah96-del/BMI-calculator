import { validateBlogPayload } from "@/app/lib/admin-blog-validation";
import { withAdminApi } from "@/app/lib/admin-api";
import { revalidateBlog } from "@/app/lib/revalidate-blog";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/auth";
import { dbPostToView } from "@/app/lib/blog-service";
import {
  deleteBlogPost,
  getBlogPostById,
  getBlogPostBySlug,
  updateBlogPost,
} from "@/app/lib/blog-repo";
import { estimateReadTime, slugify } from "@/app/lib/slug";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function gateBlogs() {
  const gate = await requirePermission("blogs");
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }
  return null;
}

async function handleGET(_req: NextRequest, context: RouteContext) {
  const denied = await gateBlogs();
  if (denied) return denied;

  const { id } = await context.params;
  const post = await getBlogPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(dbPostToView(post));
}

async function handlePUT(req: NextRequest, context: RouteContext) {
  const denied = await gateBlogs();
  if (denied) return denied;

  const { id } = await context.params;

  try {
    const existing = await getBlogPostById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const validationError = validateBlogPayload(body);
    if (validationError)
      return NextResponse.json({ error: validationError }, { status: 400 });
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let slug = String(body.slug || "").trim() || slugify(title);
    slug = slugify(slug);
    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const slugConflict = await getBlogPostBySlug(slug);
    if (slugConflict && slugConflict.id !== id) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 },
      );
    }

    const content = String(body.content || "");
    const status = body.status === "published" ? "published" : "draft";
    // Always bump last-updated when any admin saves the post
    const today = new Date().toISOString().slice(0, 10);
    const tags = Array.isArray(body.tags)
      ? body.tags.map(String)
      : String(body.tags || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);

    const post = await updateBlogPost(id, {
      title,
      slug,
      excerpt: String(body.excerpt || "").trim(),
      content,
      contentFormat: body.contentFormat === "markdown" ? "markdown" : "html",
      // Keep original publish date; never take an outdated client value as "updated"
      date: existing.date || String(body.date || today),
      updatedAt: today,
      readTime: String(body.readTime || estimateReadTime(content)),
      category: String(body.category || existing.category),
      tags,
      metaTitle: String(body.metaTitle || title).trim(),
      metaDescription: String(
        body.metaDescription || body.excerpt || "",
      ).trim(),
      focusKeyword: String(body.focusKeyword || "").trim(),
      coverImage:
        body.coverImage === null || body.coverImage === ""
          ? null
          : body.coverImage
            ? String(body.coverImage)
            : existing.coverImage,
      coverImageAlt: String(
        body.coverImageAlt ?? existing.coverImageAlt ?? "",
      ).trim(),
      featured: Boolean(body.featured),
      status,
    });

    revalidateBlog(existing.slug, post.slug);
    return NextResponse.json(dbPostToView(post));
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

async function handleDELETE(_req: NextRequest, context: RouteContext) {
  const denied = await gateBlogs();
  if (denied) return denied;

  const { id } = await context.params;
  try {
    const existing = await getBlogPostById(id);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    await deleteBlogPost(id);
    revalidateBlog(existing.slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export const GET = withAdminApi(handleGET);
export const PUT = withAdminApi(handlePUT);
export const DELETE = withAdminApi(handleDELETE);
