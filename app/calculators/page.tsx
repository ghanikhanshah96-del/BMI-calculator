import type { Metadata } from "next";
import { getPostBySlug } from "../blog/posts";
import type { GuideLinks } from "../components/tool-cards";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import { tools } from "../lib/tools";
import CalculatorsView from "./calculators-view";

const title = "All Fitness Calculators";
const description =
  "Browse every free calculator on FitnessCalculatorPro.com: BMI, body fat, TDEE, macros, due date, and ovulation, grouped by goal.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/calculators" });

export default function CalculatorsPage() {
  const guides: GuideLinks = {};
  for (const tool of tools) {
    const guide = getPostBySlug(tool.guideSlug);
    if (guide) guides[tool.id] = { slug: guide.slug, title: guide.title };
  }

  return <CalculatorsView siteUrl={getSiteUrl()} title={title} guides={guides} />;
}
