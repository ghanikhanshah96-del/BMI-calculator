import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: "BMI Wellness Pro",
  title: {
    default: "BMI Wellness Pro | BMI & Health Calculators",
    template: "%s",
  },
  description:
    "Professional BMI, calorie, macro, body fat, pregnancy, and ovulation calculators with practical health guidance.",
  keywords: [
    "BMI calculator",
    "health calculator",
    "TDEE calculator",
    "macro calculator",
    "body fat calculator",
    "pregnancy due date calculator",
    "ovulation calculator",
  ],
  authors: [{ name: "BMI Wellness Pro" }],
  creator: "BMI Wellness Pro",
  publisher: "BMI Wellness Pro",
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
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "BMI Wellness Pro | BMI & Health Calculators",
    description:
      "Free BMI, calorie, macro, body fat, pregnancy, and ovulation calculators with practical health guidance.",
    url: "/",
    siteName: "BMI Wellness Pro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "BMI Wellness Pro | BMI & Health Calculators",
    description:
      "Free BMI, calorie, macro, body fat, pregnancy, and ovulation calculators with practical health guidance.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
