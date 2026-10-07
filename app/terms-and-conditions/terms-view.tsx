"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BookOpenCheck,
  ExternalLink,
  FileText,
  HeartPulse,
  LockKeyhole,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "../components/icons";
import LegalLayout, { type LegalSection } from "../components/legal-layout";

const sections: LegalSection[] = [
  {
    id: "purpose",
    title: "1. Purpose of the website",
    icon: BookOpenCheck,
    body: [
      "FitnessCalculatorPro.com provides free online calculators and educational information on fitness, nutrition, body composition, calories, pregnancy dates, fertility timing, and related topics. The site is intended primarily for general informational and educational purposes.",
    ],
  },
  {
    id: "no-advice",
    title: "2. No medical or professional advice",
    icon: HeartPulse,
    body: [
      "Content and calculator results do not constitute medical, nutritional, legal, or other professional advice. The site is not a substitute for consultation with a qualified healthcare professional. You are responsible for seeking appropriate advice for decisions that may affect your health.",
    ],
  },
  {
    id: "results",
    title: "3. Calculator results",
    icon: FileText,
    body: [
      "Results are estimates generated from formulas, assumptions, and the information you provide. We do not guarantee that results will be exact, suitable for every person, or appropriate for any particular health, fitness, nutrition, pregnancy, or fertility decision.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable use",
    icon: AlertTriangle,
    body: ["You agree to use the site only for lawful purposes. You must not:"],
    points: [
      "Disrupt or damage the website",
      "Attempt unauthorized access",
      "Introduce viruses or harmful code",
      "Overburden the site with automation",
      "Scrape or reproduce substantial content unlawfully",
      "Misrepresent results as medical advice",
      "Use the site for fraud or abuse",
    ],
    columns: 2,
  },
  {
    id: "ip",
    title: "5. Intellectual property",
    icon: Scale,
    body: [
      "Unless otherwise stated, original text, design, graphics, branding, software, calculator implementations, and other original materials are owned by or licensed to us and may be protected by intellectual property laws.",
      "You may use the site for personal and informational purposes. Do not republish, copy, distribute, sell, or commercially exploit substantial portions without permission, except where allowed by law.",
    ],
  },
  {
    id: "links",
    title: "6. Third-party links",
    icon: ExternalLink,
    body: [
      "Links are provided for convenience. We do not control third-party websites and are not responsible for their content, policies, availability, security, products, or services.",
    ],
  },
  {
    id: "advertising",
    title: "7. Advertising",
    icon: Sparkles,
    body: [
      "The site may display advertisements, including from networks such as Google AdSense. An ad does not mean we endorse the advertiser, product, service, or claim. Transactions with advertisers are between you and that third party.",
    ],
  },
  {
    id: "availability",
    title: "8. Website availability and changes",
    icon: RefreshCw,
    body: [
      "We aim to keep the site available, but do not guarantee uninterrupted or error-free access. Features may be unavailable due to maintenance, technical issues, security concerns, updates, hosting, or events outside our control.",
      "We may add, modify, remove, or update calculators, content, features, and policies at any time.",
    ],
  },
  {
    id: "warranties",
    title: "9. Disclaimer of warranties",
    icon: ShieldCheck,
    body: [
      <>
        To the extent permitted by law, the site is provided “as is” and “as available.” We make no guarantee that all
        information will always be complete or error-free, that results will be exact, or that content will meet every
        user’s needs. Please also review our separate{" "}
        <Link href="/disclaimer" className="content-link">
          Disclaimer
        </Link>
        .
      </>,
    ],
  },
  {
    id: "liability",
    title: "10. Limitation of liability",
    icon: LockKeyhole,
    body: [
      "To the fullest extent permitted by law, FitnessCalculatorPro.com and its owners, operators, contributors, and affiliates will not be liable for indirect, incidental, consequential, or other damages arising from use of or reliance on the website, calculators, or content. Nothing excludes liability that cannot legally be excluded.",
    ],
  },
  {
    id: "privacy-terms",
    title: "11. Privacy",
    icon: ShieldCheck,
    body: [
      <>
        Your use of the website is also subject to our{" "}
        <Link href="/privacy-policy" className="content-link">
          Privacy Policy
        </Link>
        .
      </>,
    ],
  },
  {
    id: "changes",
    title: "12. Changes, severability, and contact",
    icon: RefreshCw,
    body: [
      "We may update these Terms from time to time. Updated Terms become effective when posted unless otherwise stated. Continued use after updates constitutes acceptance to the extent permitted by law.",
      "If any provision is invalid or unenforceable, the remaining provisions continue to apply. Questions about these Terms can be sent through the Contact Us page.",
    ],
  },
];

export default function TermsView({ siteUrl }: { siteUrl: string }) {
  return (
    <LegalLayout
      siteUrl={siteUrl}
      page="terms"
      path="/terms-and-conditions"
      crumb="Terms and Conditions"
      eyebrow="Terms and Conditions"
      icon={FileText}
      title="Terms and Conditions"
      intro="These Terms govern your access to and use of FitnessCalculatorPro.com, including its calculators, articles, guides, and other website features. If you do not agree, please discontinue use."
      updated="October 7, 2026"
      notice={
        <p>
          Calculator outputs support planning only. Urgent symptoms, pregnancy concerns, or medical conditions need
          professional guidance.
        </p>
      }
      sections={sections}
      cta={{
        title: "Questions about these Terms?",
        text: (
          <>
            Reach us through Contact Us, or read our{" "}
            <Link href="/disclaimer" className="content-link">
              Disclaimer
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="content-link">
              Privacy Policy
            </Link>
            .
          </>
        ),
      }}
    />
  );
}
