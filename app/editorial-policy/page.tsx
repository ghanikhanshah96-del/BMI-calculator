import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import EditorialView from "./editorial-view";

export const metadata: Metadata = pageMetadata({
  title: "Editorial Policy",
  description:
    "Learn how FitnessCalculatorPro.com researches, writes, reviews, updates, and corrects health, fitness, nutrition, pregnancy, fertility, and calculator content.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return <EditorialView siteUrl={getSiteUrl()} />;
}
