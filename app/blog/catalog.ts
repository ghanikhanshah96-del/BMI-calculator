import { getPostCard, postCards, type PostCard } from "./post-cards";
import { blogPosts, getPostBySlug, type BlogPost } from "./posts";
import {
  getPublishedFirestorePostBySlug,
  listPublishedFirestorePosts,
  type FirestoreBlogPost,
} from "../lib/firestore-blog";
import type { ToolId } from "../lib/tool-nav";

export type CatalogEntry =
  | { kind: "static"; slug: string; card: PostCard; post: BlogPost }
  | { kind: "firestore"; slug: string; card: PostCard; firestore: FirestoreBlogPost };

function categoryToToolId(category: string): ToolId {
  const c = category.toLowerCase();
  if (c.includes("bmi")) return "bmi";
  if (c.includes("body fat")) return "body-fat";
  if (c.includes("nutrition") || c.includes("macro") || c.includes("tdee")) return "macro";
  if (c.includes("ovulation")) return "ovulation";
  return "pregnancy";
}

function firestoreToCard(post: FirestoreBlogPost): PostCard {
  const staticCard = postCards.find((p) => p.slug === post.slug);
  if (staticCard) {
    return {
      ...staticCard,
      title: post.title || staticCard.title,
      excerpt: post.excerpt || post.metaDescription || staticCard.excerpt,
      updatedAt:
        (post.updatedAt || post.publishedAt || post.date || staticCard.updatedAt).slice(0, 10) ||
        staticCard.updatedAt,
      image: post.coverImage || staticCard.image,
      imageAlt: post.coverImageAlt || staticCard.imageAlt,
    };
  }

  const toolId = categoryToToolId(post.category);
  const toolHref =
    toolId === "bmi"
      ? "/bmi-calculator"
      : toolId === "body-fat"
        ? "/body-fat-percentage-calculator"
        : toolId === "macro"
          ? "/macro-calculator"
          : toolId === "ovulation"
            ? "/ovulation-calculator"
            : "/pregnancy-due-date-calculator";

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || post.metaDescription,
    toolId,
    toolLabel: post.category || "Guide",
    toolHref,
    updatedAt: (post.updatedAt || post.date || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    image: post.coverImage || "/logo.png",
    imageAlt: post.coverImageAlt || post.title,
    imageWidth: 1200,
    imageHeight: 630,
  };
}

/** Published Firestore posts plus static posts not yet in Firestore (fallback). */
export async function listCatalogEntries(): Promise<CatalogEntry[]> {
  const remote = await listPublishedFirestorePosts();
  const remoteSlugs = new Set(remote.map((p) => p.slug));
  const entries: CatalogEntry[] = remote.map((firestore) => ({
    kind: "firestore" as const,
    slug: firestore.slug,
    card: firestoreToCard(firestore),
    firestore,
  }));

  for (const post of blogPosts) {
    if (remoteSlugs.has(post.slug)) continue;
    entries.push({
      kind: "static",
      slug: post.slug,
      card: getPostCard(post.slug),
      post,
    });
  }

  entries.sort((a, b) => b.card.updatedAt.localeCompare(a.card.updatedAt));
  return entries;
}

export async function listCatalogCards(): Promise<PostCard[]> {
  const entries = await listCatalogEntries();
  return entries.map((e) => e.card);
}

export async function getCatalogEntry(slug: string): Promise<CatalogEntry | null> {
  const remote = await getPublishedFirestorePostBySlug(slug);
  if (remote) {
    return {
      kind: "firestore",
      slug: remote.slug,
      card: firestoreToCard(remote),
      firestore: remote,
    };
  }
  const post = getPostBySlug(slug);
  if (!post) return null;
  return {
    kind: "static",
    slug: post.slug,
    card: getPostCard(post.slug),
    post,
  };
}

export async function getAllCatalogSlugs(): Promise<string[]> {
  const entries = await listCatalogEntries();
  return entries.map((e) => e.slug);
}

/** Static cards kept as fallback until migration is verified. */
export { postCards };
