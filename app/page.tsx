import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import HomeView from "./home-view";
import { pageMetadata } from "./lib/seo";
import { getSiteUrl } from "./lib/site-url";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = pageMetadata({
  title: "Fitness and Health Calculators | FitnessCalculatorPro.com",
  absoluteTitle: true,
  description:
    "Free fitness and health calculators for BMI, body fat, TDEE, macros, pregnancy due date, and ovulation, with instant results and a clear guide for each.",
  path: "/",
  keywords: [
    "BMI calculator",
    "free BMI calculator",
    "body mass index calculator",
    "TDEE calculator",
    "BMR calculator",
    "macro calculator",
    "body fat calculator",
    "due date calculator",
    "ovulation calculator",
  ],
});

export default function Page() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <link rel="canonical" href={`${siteUrl}/`} />
      <meta property="og:url" content={`${siteUrl}/`} />
      <HomeView siteUrl={siteUrl} headlineClass={raleway.className} />
    </>
  );
}
