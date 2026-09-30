import type { MetadataRoute } from "next";
import { blogPosts } from "./blog/posts";
import { getSiteUrl } from "./lib/site-url";
import { SITE_UPDATED, toolHref, tools } from "./lib/tools";

const siteUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(SITE_UPDATED);

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

  const blog: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(
        blogPosts.reduce((latest, post) => (post.updatedAt > latest ? post.updatedAt : latest), SITE_UPDATED),
      ),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const company: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/about`, lastModified: updated, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: updated, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/sitemap-page`, lastModified: updated, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...core, ...toolPages, ...blog, ...company];
}
