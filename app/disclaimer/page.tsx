import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import DisclaimerView from "./disclaimer-view";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "Read the FitnessCalculatorPro.com disclaimer regarding fitness and health calculators, medical information, estimated results, external links, and advertising.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return <DisclaimerView siteUrl={getSiteUrl()} />;
}
