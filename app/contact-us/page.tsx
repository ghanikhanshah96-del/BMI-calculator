import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import ContactView from "./contact-view";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact FitnessCalculatorPro.com with calculator questions, error reports, website feedback, corrections, accessibility issues, or suggestions for new tools.",
  path: "/contact-us",
});

export default function ContactPage() {
  return <ContactView siteUrl={getSiteUrl()} />;
}
