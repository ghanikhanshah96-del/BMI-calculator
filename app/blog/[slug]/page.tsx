import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "../../lib/seo";
import { getSiteUrl } from "../../lib/site-url";
import { getAllCatalogSlugs, getCatalogEntry, listCatalogCards } from "../catalog";
import HtmlPostView from "./html-post-view";
import PostView from "./post-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllCatalogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getCatalogEntry(slug);
  if (!entry) {
    return { title: "Article not found" };
  }

  if (entry.kind === "firestore") {
    const post = entry.firestore;
    const keywords = [post.focusKeyword, ...post.tags].filter(Boolean);
    const cover = post.coverImage || "/logo.png";
    return pageMetadata({
      title: post.metaTitle || post.title,
      absoluteTitle: true,
      description: post.metaDescription || post.excerpt,
      path: `/blog/${post.slug}`,
      keywords: keywords.length ? keywords : undefined,
      type: "article",
      image: {
        url: cover,
        alt: post.coverImageAlt || post.title,
        width: 1200,
        height: 630,
      },
      article: {
        publishedTime: (post.publishedAt || post.date || "").slice(0, 10),
        modifiedTime: (post.updatedAt || post.publishedAt || post.date || "").slice(0, 10),
        section: post.category,
      },
    });
  }

  const post = entry.post;
  return pageMetadata({
    title: post.metaTitle,
    absoluteTitle: post.metaTitleAbsolute,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    image: {
      url: post.image,
      alt: post.imageAlt,
      width: post.imageWidth ?? 1023,
      height: post.imageHeight ?? 682,
    },
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.toolLabel,
    },
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [entry, cards] = await Promise.all([getCatalogEntry(slug), listCatalogCards()]);
  if (!entry) notFound();

  const articles = cards.map((c) => ({ slug: c.slug, title: c.title }));

  if (entry.kind === "firestore") {
    return <HtmlPostView siteUrl={getSiteUrl()} post={entry.firestore} articles={articles} />;
  }

  return <PostView siteUrl={getSiteUrl()} slug={entry.post.slug} articles={articles} />;
}
