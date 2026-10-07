import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import AboutView from "./about-view";

const description =
  "Learn about FitnessCalculatorPro.com, our mission, calculator methodology, editorial standards, and commitment to providing clear and useful fitness and health information.";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description,
  path: "/about-us",
});

export default function AboutPage() {
  return <AboutView siteUrl={getSiteUrl()} description={description} />;
}
