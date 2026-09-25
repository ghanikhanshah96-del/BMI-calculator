import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "BMI Wellness Pro",
  title: {
    default: "BMI Wellness Pro | Free BMI, TDEE & Health Calculators",
    template: "%s | BMI Wellness Pro",
  },
  description:
    "BMI Wellness Pro is a free online health calculator suite: BMI, TDEE/BMR, body fat, macros, pregnancy due date, and ovulation—with clear guides for each tool.",
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
  authors: [{ name: "BMI Wellness Pro" }],
  creator: "BMI Wellness Pro",
  publisher: "BMI Wellness Pro",
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
    title: "BMI Wellness Pro | Free BMI, TDEE & Health Calculators",
    description:
      "Calculate BMI, calories (TDEE), body fat, macros, due date, and ovulation online—free tools with step-by-step guides.",
    url: "/",
    siteName: "BMI Wellness Pro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Wellness Pro | Free BMI, TDEE & Health Calculators",
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
        name: "BMI Wellness Pro",
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description:
          "Free online BMI and wellness calculators for body mass index, calorie needs, body fat, macros, pregnancy due date, and ovulation.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "BMI Wellness Pro",
        description:
          "Free health calculators: BMI, TDEE, body fat percentage, macro planner, pregnancy due date, and ovulation fertile window.",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
