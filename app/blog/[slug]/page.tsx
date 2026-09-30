import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "../../lib/seo";
import { getSiteUrl } from "../../lib/site-url";
import { getAllSlugs, getPostBySlug } from "../posts";
import PostView from "./post-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }

  return pageMetadata({
    title: post.metaTitle,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    image: { url: post.image, alt: post.imageAlt },
    article: { publishedTime: post.publishedAt, modifiedTime: post.updatedAt, section: post.toolLabel },
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return <PostView siteUrl={getSiteUrl()} slug={post.slug} />;
}
