import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import PrivacyView from "./privacy-view";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How FitnessCalculatorPro.com handles calculator inputs, contact messages, cookies, and your privacy when using our free health calculators.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyView siteUrl={getSiteUrl()} />;
}
