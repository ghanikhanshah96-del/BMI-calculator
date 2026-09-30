import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import ContactView from "./contact-view";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact FitnessCalculatorPro.com with questions about our BMI, TDEE, macro, body fat, pregnancy, and ovulation calculators.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactView siteUrl={getSiteUrl()} />;
}
