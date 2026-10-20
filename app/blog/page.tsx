import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import BlogIndexView from "./blog-index-view";
import { listCatalogCards } from "./catalog";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Health articles",
  description:
    "Guides that explain how our calculators work, what the results mean, and where a single number needs more context.",
  path: "/blog",
  keywords: ["BMI", "pregnancy due date", "fitness calculators", "health articles"],
});

export default async function BlogIndexPage() {
  const posts = await listCatalogCards();
  return <BlogIndexView siteUrl={getSiteUrl()} posts={posts} />;
}
