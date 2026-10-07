import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import PrivacyView from "./privacy-view";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Read the FitnessCalculatorPro.com Privacy Policy to understand how information, cookies, analytics, advertising technologies, and contact form data may be handled.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return <PrivacyView siteUrl={getSiteUrl()} />;
}
