import type { Metadata } from "next";
import HomeClient from "./home-client";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const metadata: Metadata = {
  title: "Free BMI Calculator & Health Tools",
  description:
    "Free online BMI calculator plus TDEE/BMR, body fat, macro planner, pregnancy due date, and ovulation tools. Instant results with guides for every calculator.",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free BMI Calculator & Health Tools | BMI Wellness Pro",
    description:
      "Calculate BMI, daily calories, body fat, macros, due date, and ovulation in one place—free and easy to use.",
    url: "/",
    siteName: "BMI Wellness Pro",
    type: "website",
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteUrl}/#webapp`,
    name: "BMI Wellness Pro",
    alternateName: "BMI Calculator Suite",
    applicationCategory: "HealthApplication",
    applicationSubCategory: "Body Mass Index and Wellness Calculators",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    url: `${siteUrl}/`,
    image: `${siteUrl}/icon.svg`,
    description:
      "BMI Wellness Pro helps people calculate Body Mass Index (BMI), total daily energy expenditure (TDEE), body fat percentage, nutrition macros, pregnancy due date, and ovulation fertile window using established formulas.",
    about: [
      "Body Mass Index",
      "Calorie and TDEE planning",
      "Body composition",
      "Pregnancy dating",
      "Fertility window estimates",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "BMI calculator with healthy weight range",
      "TDEE and BMR calculator (Mifflin St Jeor)",
      "Macro planner for protein, carbs, and fat",
      "Body fat calculator (U.S. Navy method)",
      "Pregnancy due date calculator",
      "Ovulation and fertile window calculator",
    ],
    isAccessibleForFree: true,
    inLanguage: "en-US",
    provider: {
      "@type": "Organization",
      name: "BMI Wellness Pro",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient />
    </>
  );
}
