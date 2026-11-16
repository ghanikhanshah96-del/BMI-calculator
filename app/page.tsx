import type { Metadata } from "next";
import localFont from "next/font/local";
import HomeView from "./home-view";
import { pageMetadata } from "./lib/seo";
import { getSiteUrl } from "./lib/site-url";

const raleway = localFont({
  src: "./fonts/raleway-latin.woff2",
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = pageMetadata({
  title: "Free Fitness & Health Calculators | FitnessCalculatorPro",
  absoluteTitle: true,
  description:
    "Use free calculators for BMI, TDEE, body fat percentage, macros, pregnancy due dates and ovulation. Get quick estimates with clear explanations.",
  path: "/",
  keywords: [
    "Free Fitness & Health Calculators",
    "BMI Calculator",
    "TDEE Calculator",
    "Body Fat Percentage Calculator",
    "Macro Calculator",
    "Pregnancy Due Date Calculator",
    "Ovulation Calculator",
  ],
});

export default function Page() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <link rel="canonical" href={`${siteUrl}/`} />
      <meta property="og:url" content={`${siteUrl}/`} />
      <meta name="google-site-verification" content="MD9KLyvnTX7n7lzBOZt_JVl3Ug7NaCmAZAbtny5cWQc" />
      <HomeView siteUrl={siteUrl} headlineClass={raleway.className} />
    </>
  );
}
