import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import TermsView from "./terms-view";

export const metadata: Metadata = pageMetadata({
  title: "Terms and Conditions",
  description:
    "Review the Terms and Conditions governing your use of FitnessCalculatorPro.com, its free health and fitness calculators, educational content, and website features.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return <TermsView siteUrl={getSiteUrl()} />;
}
