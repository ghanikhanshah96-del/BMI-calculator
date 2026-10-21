import type { MetadataRoute } from "next";
import { listCatalogCards } from "./blog/catalog";
import { getSiteUrl } from "./lib/site-url";
import { SITE_UPDATED, toolHref, tools } from "./lib/tools";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const updated = new Date(SITE_UPDATED);
  const cards = await listCatalogCards();

  const core: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/calculators`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.95,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}${toolHref(tool)}`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.95,
  }));

  const latestBlog = cards.reduce(
    (latest, post) => (post.updatedAt > latest ? post.updatedAt : latest),
    SITE_UPDATED,
  );

  const blog: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(latestBlog),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...cards.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const company: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/team/editorial`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about-us`, lastModified: updated, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contact-us`, lastModified: updated, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/sitemap-page`, lastModified: updated, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy-policy`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms-and-conditions`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/disclaimer`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/editorial-policy`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...core, ...toolPages, ...blog, ...company];
}
