import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "BMI Calculator | Free BMI, TDEE & Health Tools",
  description:
    "Use BMI Wellness Pro to calculate BMI, healthy weight range, TDEE calories, macros, body fat, pregnancy due date, and ovulation window.",
  keywords: [
    "BMI calculator",
    "body mass index calculator",
    "health calculator",
    "TDEE calculator",
    "macro calculator",
    "body fat calculator",
    "healthy weight calculator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BMI Calculator | BMI Wellness Pro",
    description:
      "Free BMI, calorie, macro, body fat, pregnancy, and ovulation calculators with simple health guidance.",
    url: "/",
    siteName: "BMI Wellness Pro",
    type: "website",
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BMI Wellness Pro",
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    url: "/",
    description:
      "Free BMI, calorie, macro, body fat, pregnancy, and ovulation calculators with practical health guidance.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "BMI calculator",
      "TDEE calculator",
      "Macro calculator",
      "Body fat calculator",
      "Pregnancy due date calculator",
      "Ovulation calculator",
    ],
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
