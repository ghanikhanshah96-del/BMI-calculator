"use client";

import Link from "next/link";
import { Baby, Clock, Cookie, Database, LockKeyhole, Mail, RefreshCw, Server, ShieldCheck } from "../components/icons";
import LegalLayout, { type LegalSection } from "../components/legal-layout";

const ctaLink = "font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white";

const sections: LegalSection[] = [
  {
    id: "calculator-inputs",
    title: "Calculator inputs",
    icon: Database,
    body: [
      "Height, weight, age, activity level, body measurements, cycle dates, and every other value you type into a calculator are processed by JavaScript in your own browser to show the result on the page.",
      "These numbers are not sent to our servers, we do not require an account, and we do not build a profile or medical record from them. Closing or refreshing the page clears them.",
    ],
  },
  {
    id: "contact-messages",
    title: "Contact messages",
    icon: Mail,
    body: [
      "If you use the Contact page, we receive the name, email address, and message you submit so that we can reply to you.",
      "Before a message is sent, the form checks that the email domain can receive mail, which helps us avoid replies that bounce. Messages are delivered to our inbox through a transactional email provider that processes them on our behalf.",
      "We use this information only to respond to your request and to improve our calculators and guides. We never sell it or use it for advertising.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep messages",
    icon: Clock,
    body: [
      "Contact messages are kept only for as long as we need them to answer your question and handle any follow-up, and are then deleted.",
      "You can ask us at any time to delete a message you sent, and we will confirm once it has been removed.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    icon: Cookie,
    body: [
      "The calculators and guides work without login, advertising, or tracking cookies.",
      "If we add privacy-friendly analytics in the future, it would be used to measure page performance and which content is most helpful, and this policy will be updated before it goes live.",
    ],
  },
  {
    id: "server-logs",
    title: "Hosting and server logs",
    icon: Server,
    body: [
      "Like almost every website, our hosting infrastructure automatically records basic technical data for each request, such as IP address, browser type, the page requested, and the time.",
      "These logs are used to keep the site secure, diagnose errors, and prevent abuse. They are not linked to calculator inputs, which never leave your browser.",
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    icon: Baby,
    body: [
      "Our content is written for adults. BMI categories on this site apply to adults, and children and teens should use age- and sex-specific growth charts with a pediatrician.",
      "We do not knowingly collect personal information from children under 13. If you believe a child has sent us a message, contact us and we will delete it.",
    ],
  },
  {
    id: "your-choices",
    title: "Your choices",
    icon: LockKeyhole,
    body: [
      "Use private browsing on shared devices and clear your history if health searches feel sensitive.",
      "Avoid entering information you would not want visible on a public screen, and only include the details we need when you write to us.",
      "Calculator outputs are educational estimates, not a diagnosis.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    icon: RefreshCw,
    body: [
      "If the way we handle information changes, we will update this page and the date at the top. Significant changes will be described in plain language so they are easy to spot.",
    ],
  },
];

export default function PrivacyView({ siteUrl }: { siteUrl: string }) {
  return (
    <LegalLayout
      siteUrl={siteUrl}
      page="privacy"
      path="/privacy"
      crumb="Privacy Policy"
      eyebrow="Privacy"
      icon={ShieldCheck}
      title="Privacy policy"
      intro="FitnessCalculatorPro.com is a free health calculator suite. This page explains, in plain language, what happens to information when you use our tools or contact us."
      updated="September 30, 2026"
      sections={sections}
      cta={{
        title: "Privacy questions?",
        text: (
          <>
            Send a message through our Contact page to ask a question or request deletion. You can also review our{" "}
            <Link href="/terms" className={ctaLink}>
              Terms of Use
            </Link>{" "}
            or browse{" "}
            <Link href="/calculators" className={ctaLink}>
              all calculators
            </Link>
            .
          </>
        ),
      }}
    />
  );
}
