import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import ReviewProvider from "./components/review-provider";
import CursorEffects from "./components/cursor-effects";
import FirebaseAnalytics from "./components/firebase-analytics";
import RevealObserver from "./components/reveal-observer";
import SiteJsonLd from "./components/site-json-ld";
import SmoothScroll from "./components/smooth-scroll";
import TooltipLayer from "./components/tooltip-layer";
import { defaultOgImage } from "./lib/seo";
import { getSiteUrl } from "./lib/site-url";
import "./globals.css";
import "./niche.css";
import "./components/reviews.css";

const plusJakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  weight: "200 800",
  variable: "--font-plus-jakarta",
  display: "swap",
});

const fraunces = localFont({
  src: "./fonts/fraunces-latin.woff2",
  variable: "--font-fraunces",
  weight: "400 600",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "FitnessCalculatorPro.com",
  title: {
    default: "Free Health Calculators | FitnessCalculatorPro.com",
    template: "%s | FitnessCalculatorPro.com",
  },
  description:
    "Free online health calculators for BMI, TDEE, body fat, macros, pregnancy due date, and ovulation, with a clear guide for each tool.",
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
  verification: {
    google: "lt61VQpZsjNOwJ6P-Ek_OlZWjf2mu8K10TfXODMLeZk",
  },
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
  openGraph: {
    title: "Free Health Calculators | FitnessCalculatorPro.com",
    description:
      "Calculate BMI, calories (TDEE), body fat, macros, due date, and ovulation online with free tools and step-by-step guides.",
    siteName: "FitnessCalculatorPro.com",
    locale: "en_US",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Health Calculators | FitnessCalculatorPro.com",
    description:
      "Calculate BMI, calories (TDEE), body fat, macros, due date, and ovulation online with free tools and step-by-step guides.",
    images: [{ url: defaultOgImage.url, alt: defaultOgImage.alt }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9309280380486229"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <FirebaseAnalytics />
        <SiteJsonLd siteUrl={siteUrl} />
        {children}
        <ReviewProvider />
        <RevealObserver />
        <SmoothScroll />
        <CursorEffects />
        <TooltipLayer />
      </body>
    </html>
  );
}
