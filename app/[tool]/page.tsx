import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import { clusters, getToolBySlug, SITE_UPDATED, toolHref, tools } from "../lib/tools";
import ToolView from "./tool-view";

type PageProps = {
  params: Promise<{ tool: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Calculator not found" };

  return pageMetadata({
    title: tool.metaTitle,
    description: tool.metaDescription,
    path: toolHref(tool),
    keywords: tool.keywords,
    image: { url: tool.heroImage, alt: tool.heroImageAlt },
  });
}

export default async function ToolPage({ params }: PageProps) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const cluster = clusters.find((item) => item.id === tool.cluster);
  const { id, heroImage, heroImageAlt, metaDescription, relatedToolIds } = tool;

  return (
    <ToolView
      siteUrl={getSiteUrl()}
      updated={SITE_UPDATED}
      clusterTitle={cluster?.title ?? "Calculator"}
      tool={{ id, heroImage, heroImageAlt, metaDescription, relatedToolIds }}
    />
  );
}
