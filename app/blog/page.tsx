import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import BlogIndexView from "./blog-index-view";

export const metadata: Metadata = pageMetadata({
  title: "Health Calculator Blog",
  description:
    "In-depth guides for BMI, TDEE, body fat, macros, pregnancy due date, and ovulation calculators from FitnessCalculatorPro.com.",
  path: "/blog",
  keywords: [
    "BMI blog",
    "TDEE guide",
    "body fat guide",
    "macro planner guide",
    "due date guide",
    "ovulation guide",
  ],
});

export default function BlogIndexPage() {
  return <BlogIndexView siteUrl={getSiteUrl()} />;
}
