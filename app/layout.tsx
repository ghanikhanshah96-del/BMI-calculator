import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import CursorEffects from "./components/cursor-effects";
import RevealObserver from "./components/reveal-observer";
import SmoothScroll from "./components/smooth-scroll";
import { getSiteUrl } from "./lib/site-url";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "FitnessCalculatorPro.com",
  title: {
    default: "FitnessCalculatorPro.com | Free BMI, TDEE & Health Calculators",
    template: "%s | FitnessCalculatorPro.com",
  },
  description:
    "FitnessCalculatorPro.com is a free online health calculator suite: BMI, TDEE/BMR, body fat, macros, pregnancy due date, and ovulation—with clear guides for each tool.",
  keywords: [
    "BMI calculator",
    "free BMI calculator",
    "TDEE calculator",
    "BMR calculator",
    "macro calculator",
    "body fat calculator",
    "pregnancy due date calculator",
    "ovulation calculator",
    "health calculator",
  ],
  authors: [{ name: "FitnessCalculatorPro.com" }],
  creator: "FitnessCalculatorPro.com",
  publisher: "FitnessCalculatorPro.com",
  category: "health",
  classification: "Health Calculators",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "FitnessCalculatorPro.com | Free BMI, TDEE & Health Calculators",
    description:
      "Calculate BMI, calories (TDEE), body fat, macros, due date, and ovulation online—free tools with step-by-step guides.",
    url: "/",
    siteName: "FitnessCalculatorPro.com",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitnessCalculatorPro.com | Free BMI, TDEE & Health Calculators",
    description:
      "Calculate BMI, calories (TDEE), body fat, macros, due date, and ovulation online—free tools with step-by-step guides.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "FitnessCalculatorPro.com",
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description:
          "Free online BMI and wellness calculators for body mass index, calorie needs, body fat, macros, pregnancy due date, and ovulation.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "FitnessCalculatorPro.com",
        description:
          "Free health calculators: BMI, TDEE, body fat percentage, macro planner, pregnancy due date, and ovulation fertile window.",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <RevealObserver />
        <SmoothScroll />
        <CursorEffects />
      </body>
    </html>
  );
}
