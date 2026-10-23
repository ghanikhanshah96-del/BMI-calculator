import { cache } from "react";
import { renderBlogContentHtml } from "./blog-content";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import {
  BLOG_POSTS_COLLECTION,
  getDb,
  isFirebaseConfigured,
} from "./firebase-admin";
import { sanitizeBlogHtml } from "./sanitize-html";

export type FirestoreBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  updatedAt: string | null;
  publishedAt: string | null;
  readTime: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  coverImage: string | null;
  coverImageAlt: string;
  featured: boolean;
  status: string;
};

function docToPost(snap: QueryDocumentSnapshot): FirestoreBlogPost | null {
  const data = snap.data();
  const slug = String(data.slug || "");
  const status = String(data.status || "draft");
  if (!slug || status !== "published") return null;
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  return {
    id: snap.id,
    slug,
    title: String(data.title || ""),
    excerpt: String(data.excerpt || ""),
    content: sanitizeBlogHtml(
      renderBlogContentHtml(String(data.content || ""), data.contentFormat),
    ),
    date: String(data.date || ""),
    updatedAt: data.updatedAt == null ? null : String(data.updatedAt),
    publishedAt: data.publishedAt == null ? null : String(data.publishedAt),
    readTime: String(data.readTime || "5 min read"),
    category: String(data.category || "General"),
    tags,
    metaTitle: String(data.metaTitle || data.title || ""),
    metaDescription: String(data.metaDescription || data.excerpt || ""),
    focusKeyword: String(data.focusKeyword || ""),
    coverImage: data.coverImage ? String(data.coverImage) : null,
    coverImageAlt: String(data.coverImageAlt || ""),
    featured: Boolean(data.featured),
    status,
  };
}

export async function listPublishedFirestorePosts(): Promise<
  FirestoreBlogPost[]
> {
  if (!isFirebaseConfigured()) return [];
  try {
    const snap = await getDb()
      .collection(BLOG_POSTS_COLLECTION)
      .where("status", "==", "published")
      .get();
    const posts = snap.docs
      .map((doc) => docToPost(doc))
      .filter((p): p is FirestoreBlogPost => Boolean(p));
    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return posts;
  } catch (error) {
    console.error("[firestore-blog] listPublishedFirestorePosts failed", error);
    return [];
  }
}

export async function getPublishedFirestorePostBySlug(
  slug: string,
): Promise<FirestoreBlogPost | null> {
  if (!isFirebaseConfigured() || !slug) return null;
  try {
    const snap = await getDb()
      .collection(BLOG_POSTS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return docToPost(snap.docs[0]);
  } catch (error) {
    console.error(
      "[firestore-blog] getPublishedFirestorePostBySlug failed",
      error,
    );
    return null;
  }
}

const managedDocuments = cache(async () => {
  if (!isFirebaseConfigured()) return [];
  const snap = await getDb().collection(BLOG_POSTS_COLLECTION).get();
  return snap.docs.map(
    (doc) =>
      ({ id: doc.id, ...doc.data() }) as {
        id: string;
        slug?: string;
        originalSlug?: string;
      },
  );
});
export async function getManagedBlogSlugs(): Promise<Set<string>> {
  return new Set(
    (await managedDocuments()).flatMap((doc) =>
      [doc.slug, doc.originalSlug].filter((v): v is string => Boolean(v)),
    ),
  );
}
