import type { Metadata } from "next";
import { listCatalogCards } from "../blog/catalog";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import SitemapView from "./sitemap-view";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Sitemap",
  description:
    "Complete sitemap for FitnessCalculatorPro.com: free BMI, TDEE, body fat, macro, pregnancy due date, and ovulation calculators plus guides.",
  path: "/sitemap-page",
});

export default async function HtmlSitemapPage() {
  const articles = await listCatalogCards();
  return <SitemapView siteUrl={getSiteUrl()} articles={articles} />;
}
