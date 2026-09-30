import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import AboutView from "./about-view";

const description =
  "Why FitnessCalculatorPro.com builds free health calculators, the published formulas behind each tool, our sources, and the limits of every estimate.";

export const metadata: Metadata = pageMetadata({
  title: "About Us and Our Methodology",
  description,
  path: "/about",
});

export default function AboutPage() {
  return <AboutView siteUrl={getSiteUrl()} description={description} />;
}
