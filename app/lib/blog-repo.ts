import { staticAdminPosts } from "./static-admin-posts";
import { renderBlogContentHtml } from "./blog-content";
import { sanitizeBlogHtml } from "./sanitize-html";
import { randomBytes } from "crypto";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { BLOG_POSTS_COLLECTION, getDb } from "@/app/lib/firebase-admin";

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentFormat: "html" | "markdown";
  date: string;
  updatedAt: string | null;
  readTime: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  coverImage: string | null;
  coverImageAlt: string;
  featured: boolean;
  status: "draft" | "published" | string;
  createdAt: string;
  modifiedAt: string;
};

export type BlogPostWriteInput = {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  contentFormat?: "html" | "markdown";
  date?: string;
  updatedAt?: string | null;
  readTime?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  coverImage?: string | null;
  coverImageAlt?: string;
  featured?: boolean;
  status?: string;
};

function newId() {
  return `bp_${randomBytes(12).toString("hex")}`;
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      /* ignore */
    }
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
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

export function docToRecord(
  snap: QueryDocumentSnapshot | { id: string; data: () => DocumentData },
): BlogPostRecord {
  const data = snap.data();
  const tags = normalizeTags(data.tags);
  return {
    id: snap.id,
    slug: String(data.slug || ""),
    title: String(data.title || ""),
    excerpt: String(data.excerpt || ""),
    content: String(data.content || ""),
    contentFormat: data.contentFormat === "markdown" ? "markdown" : "html",
    date: String(data.date || ""),
    updatedAt: data.updatedAt == null ? null : String(data.updatedAt),
    readTime: String(data.readTime || "5 min read"),
    category: String(data.category || "Health & Fitness"),
    tags,
    metaTitle: String(data.metaTitle || data.title || ""),
    metaDescription: String(data.metaDescription || data.excerpt || ""),
    focusKeyword: String(data.focusKeyword || ""),
    coverImage: data.coverImage ? String(data.coverImage) : null,
    coverImageAlt: String(data.coverImageAlt || ""),
    featured: Boolean(data.featured),
    status: String(data.status || "draft"),
    createdAt: toIso(data.createdAt),
    modifiedAt: toIso(data.modifiedAt),
  };
}

function collection() {
  return getDb().collection(BLOG_POSTS_COLLECTION);
}

export async function listBlogPosts(options?: {
  status?: string;
  orderBy?: "date" | "modifiedAt";
}): Promise<BlogPostRecord[]> {
  const snap = await collection().get();
  const remote = snap.docs.map(docToRecord);
  const ids = new Set(remote.map((p) => p.id));
  const slugs = new Set(remote.map((p) => p.slug));
  const posts = [
    ...remote,
    ...staticAdminPosts().filter((p) => !ids.has(p.id) && !slugs.has(p.slug)),
  ].filter(
    (p) =>
      p.status !== "deleted" &&
      (!options?.status || p.status === options.status),
  );
  return posts.sort((a, b) =>
    options?.orderBy === "date"
      ? b.date.localeCompare(a.date)
      : b.modifiedAt.localeCompare(a.modifiedAt),
  );
}

export async function getBlogPostById(
  id: string,
): Promise<BlogPostRecord | null> {
  const snap = await collection().doc(id).get();
  if (!snap.exists) return staticAdminPosts().find((p) => p.id === id) || null;
  return docToRecord(snap as QueryDocumentSnapshot);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostRecord | null> {
  const snap = await collection().where("slug", "==", slug).limit(1).get();
  if (snap.empty)
    return staticAdminPosts().find((p) => p.slug === slug) || null;
  return docToRecord(snap.docs[0]);
}

export async function createBlogPost(
  input: BlogPostWriteInput,
): Promise<BlogPostRecord> {
  const now = new Date().toISOString();
  const id = newId();
  const data = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt || "",
    content: sanitizeBlogHtml(
      renderBlogContentHtml(input.content || "", input.contentFormat),
    ),
    contentFormat: "html" as const,
    date: input.date || now.slice(0, 10),
    updatedAt: input.updatedAt ?? null,
    readTime: input.readTime || "5 min read",
    category: input.category || "Health & Fitness",
    tags: input.tags || [],
    metaTitle: input.metaTitle || input.title,
    metaDescription: input.metaDescription || input.excerpt || "",
    focusKeyword: input.focusKeyword || "",
    coverImage: input.coverImage ?? null,
    coverImageAlt: input.coverImageAlt || "",
    featured: Boolean(input.featured),
    status: input.status || "draft",
    createdAt: now,
    modifiedAt: now,
  };
  await collection().doc(id).set(data);
  return { id, ...data };
}

export async function updateBlogPost(
  id: string,
  input: BlogPostWriteInput,
): Promise<BlogPostRecord> {
  const now = new Date().toISOString();
  const data = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt || "",
    content: sanitizeBlogHtml(
      renderBlogContentHtml(input.content || "", input.contentFormat),
    ),
    contentFormat: "html" as const,
    date: input.date || now.slice(0, 10),
    updatedAt: input.updatedAt ?? now.slice(0, 10),
    readTime: input.readTime || "5 min read",
    category: input.category || "Health & Fitness",
    tags: input.tags || [],
    metaTitle: input.metaTitle || input.title,
    metaDescription: input.metaDescription || input.excerpt || "",
    focusKeyword: input.focusKeyword || "",
    coverImage: input.coverImage ?? null,
    coverImageAlt: input.coverImageAlt || "",
    featured: Boolean(input.featured),
    status: input.status || "draft",
    modifiedAt: now,
  };
  await collection()
    .doc(id)
    .set(
      {
        ...data,
        ...(id.startsWith("static_")
          ? { originalSlug: id.slice(7), createdAt: now }
          : {}),
      },
      { merge: true },
    );
  const updated = await getBlogPostById(id);
  if (!updated) throw new Error("Post missing after update");
  return updated;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (id.startsWith("static_")) {
    await collection()
      .doc(id)
      .set(
        {
          slug: id.slice(7),
          originalSlug: id.slice(7),
          status: "deleted",
          modifiedAt: new Date().toISOString(),
        },
        { merge: true },
      );
  } else {
    await collection().doc(id).delete();
  }
}

export async function countBlogPosts(status?: string): Promise<number> {
  return (await listBlogPosts({ status })).length;
}

export async function upsertBlogPostBySlug(
  input: BlogPostWriteInput,
): Promise<BlogPostRecord> {
  const existing = await getBlogPostBySlug(input.slug);
  if (existing) {
    return updateBlogPost(existing.id, {
      ...input,
      date: input.date || existing.date,
    });
  }
  return createBlogPost(input);
}
