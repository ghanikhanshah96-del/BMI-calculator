import { validateBlogPayload } from "@/app/lib/admin-blog-validation";
import { withAdminApi } from "@/app/lib/admin-api";
import { revalidateBlog } from "@/app/lib/revalidate-blog";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/auth";
import { dbPostToView } from "@/app/lib/blog-service";
import {
  createBlogPost,
  getBlogPostBySlug,
  listBlogPosts,
} from "@/app/lib/blog-repo";
import { estimateReadTime, slugify } from "@/app/lib/slug";

async function handleGET() {
  const gate = await requirePermission("blogs");
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  const posts = await listBlogPosts({ orderBy: "modifiedAt" });
  return NextResponse.json(posts.map(dbPostToView));
}

async function handlePOST(req: NextRequest) {
  const gate = await requirePermission("blogs");
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  try {
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

    const existing = await getBlogPostBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 },
      );
    }

    const content = String(body.content || "");
    const status = body.status === "published" ? "published" : "draft";
    const today = new Date().toISOString().slice(0, 10);
    const tags = Array.isArray(body.tags)
      ? body.tags.map(String)
      : String(body.tags || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);

    const post = await createBlogPost({
      title,
      slug,
      excerpt: String(body.excerpt || "").trim(),
      content,
      contentFormat: "html",
      date: String(body.date || today),
      updatedAt: status === "published" ? today : null,
      readTime: String(body.readTime || estimateReadTime(content)),
      category: String(body.category || "Health & Fitness"),
      tags,
      metaTitle: String(body.metaTitle || title).trim(),
      metaDescription: String(
        body.metaDescription || body.excerpt || "",
      ).trim(),
      focusKeyword: String(body.focusKeyword || "").trim(),
      coverImage: body.coverImage ? String(body.coverImage) : null,
      coverImageAlt: String(body.coverImageAlt || "").trim(),
      featured: Boolean(body.featured),
      status,
    });

    revalidateBlog(post.slug);
    return NextResponse.json(dbPostToView(post), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

export const GET = withAdminApi(handleGET);
export const POST = withAdminApi(handlePOST);
