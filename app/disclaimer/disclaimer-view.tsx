"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarHeart,
  ExternalLink,
  FileText,
  HeartPulse,
  Scale,
  ShieldCheck,
  Sparkles,
} from "../components/icons";
import LegalLayout, { type LegalSection } from "../components/legal-layout";

const sections: LegalSection[] = [
  {
    id: "not-medical",
    title: "Not medical advice",
    icon: HeartPulse,
    body: [
      "FitnessCalculatorPro.com does not provide medical advice, diagnosis, treatment, or emergency healthcare services. Nothing on this site replaces consultation with a physician, registered dietitian, midwife, fertility specialist, or other qualified professional.",
      "Do not disregard professional advice or delay care because of information from this website. For a medical emergency, contact local emergency services immediately.",
    ],
  },
  {
    id: "estimates",
    title: "Calculator results are estimates",
    icon: FileText,
    body: [
      "Our calculators use formulas, assumptions, and information you enter. Results are estimates only. Actual calorie needs, body composition, pregnancy dates, ovulation timing, and other measurements can vary significantly between individuals.",
      "A calculator result does not guarantee a particular health, fitness, fertility, pregnancy, or weight-management outcome.",
    ],
  },
  {
    id: "no-relationship",
    title: "No doctor–patient or professional relationship",
    icon: ShieldCheck,
    body: [
      "Using this website does not create a doctor–patient, dietitian–client, or other professional relationship. Information provided here or in general replies should not be treated as individualized professional advice.",
    ],
  },
  {
    id: "accuracy",
    title: "Accuracy of information",
    icon: Scale,
    body: [
      "We make reasonable efforts to provide useful and accurate information, but we do not guarantee that all content will always be complete, error-free, current, or applicable to every person. Verify important health information with a qualified professional before relying on it for significant decisions.",
    ],
  },
  {
    id: "fitness",
    title: "Fitness and nutrition disclaimer",
    icon: HeartPulse,
    body: [
      "Exercise capacity, calorie needs, nutrition, metabolism, and body composition differ from person to person. Before major changes to exercise, diet, calorie intake, or weight-management plans, consider consulting a qualified professional — especially if you have a medical condition, take medication, are pregnant, or have special dietary needs.",
    ],
  },
  {
    id: "pregnancy",
    title: "Pregnancy and fertility disclaimer",
    icon: CalendarHeart,
    body: [
      "Due dates, ovulation dates, and fertile windows are estimates. Actual dates may differ. These tools cannot confirm pregnancy or ovulation, diagnose infertility, identify complications, or replace testing or professional evaluation.",
    ],
  },
  {
    id: "links",
    title: "External links",
    icon: ExternalLink,
    body: [
      "Links to third-party sites are for convenience. We do not control those sites and do not guarantee their availability, accuracy, security, privacy practices, products, services, or content.",
    ],
  },
  {
    id: "ads",
    title: "Advertising disclaimer",
    icon: Sparkles,
    body: [
      "The site may display ads from third-party networks, including Google AdSense. An advertisement does not mean we recommend or endorse the advertiser or its claims. Advertising does not determine calculator results or editorial conclusions.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of responsibility",
    icon: AlertTriangle,
    body: [
      "To the extent permitted by law, FitnessCalculatorPro.com and its owners, contributors, operators, and affiliates are not responsible for losses, injuries, damages, or other consequences arising from reliance on website content or calculator results. You decide how you use the information provided.",
    ],
  },
];

export default function DisclaimerView({ siteUrl }: { siteUrl: string }) {
  return (
    <LegalLayout
      siteUrl={siteUrl}
      page="disclaimer"
      path="/disclaimer"
      crumb="Disclaimer"
      eyebrow="Disclaimer"
      icon={AlertTriangle}
      title="Disclaimer"
      intro="The information, calculators, guides, articles, and other content on FitnessCalculatorPro.com are provided for general informational and educational purposes only."
      updated="October 7, 2026"
      sections={sections}
      cta={{
        title: "Found a possible error?",
        text: (
          <>
            Contact us through the Contact Us page so we can review it. You can also read our{" "}
            <Link href="/terms-and-conditions" className="content-link">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/editorial-policy" className="content-link">
              Editorial Policy
            </Link>
            .
          </>
        ),
      }}
    />
  );
}
