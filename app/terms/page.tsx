import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import TermsView from "./terms-view";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Terms for using FitnessCalculatorPro.com free BMI, TDEE, body fat, macro, pregnancy due date, and ovulation calculators.",
  path: "/terms",
});

export default function TermsPage() {
  return <TermsView siteUrl={getSiteUrl()} />;
}
