import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import SitemapView from "./sitemap-view";

export const metadata: Metadata = pageMetadata({
  title: "Sitemap",
  description:
    "Complete sitemap for FitnessCalculatorPro.com: free BMI, TDEE, body fat, macro, pregnancy due date, and ovulation calculators plus guides.",
  path: "/sitemap-page",
});

export default function HtmlSitemapPage() {
  return <SitemapView siteUrl={getSiteUrl()} />;
}
