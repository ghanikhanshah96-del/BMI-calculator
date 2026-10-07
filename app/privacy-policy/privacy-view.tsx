"use client";

import Link from "next/link";
import {
  Baby,
  Cookie,
  Database,
  ExternalLink,
  LockKeyhole,
  Mail,
  RefreshCw,
  Scale,
  Server,
  ShieldCheck,
  Sparkles,
} from "../components/icons";
import LegalLayout, { type LegalSection } from "../components/legal-layout";

const sections: LegalSection[] = [
  {
    id: "calculator-inputs",
    title: "Information you enter into calculators",
    icon: Database,
    body: [
      "Calculator values are intended to be processed in your browser and are not intentionally collected by us as personal health records.",
      "Your browser, device, hosting provider, analytics, advertising, or other technologies may still process certain technical information as described below. Avoid entering confidential information unless necessary.",
    ],
  },
  {
    id: "voluntary",
    title: "Information you voluntarily provide",
    icon: Mail,
    body: ["We may receive information you voluntarily submit when you:"],
    points: [
      "Contact us through a contact form",
      "Send feedback or report an error",
      "Submit a correction",
      "Make a business or advertising inquiry",
      "Communicate with us another way",
    ],
    columns: 2,
  },
  {
    id: "automatic",
    title: "Information collected automatically",
    icon: Server,
    body: [
      "When you visit the site, technical information may be collected automatically by hosting, analytics, advertising, security, or similar technologies.",
    ],
    points: [
      "IP address",
      "Browser and device type",
      "Operating system",
      "Referring website",
      "Pages visited",
      "Approximate location (from IP)",
      "Date and time of visits",
      "Usage and cookie identifiers",
    ],
    columns: 2,
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    icon: Cookie,
    body: [
      "Cookies are small data files that may remember preferences, measure usage, maintain security, or support advertising. You can control cookies in your browser; blocking some may affect features.",
    ],
    points: [
      "Essential or functional cookies",
      "Analytics cookies",
      "Advertising cookies",
      "Security-related cookies",
      "Preference cookies",
    ],
    columns: 2,
  },
  {
    id: "ads",
    title: "Google AdSense and advertising",
    icon: Sparkles,
    body: [
      "We may use Google AdSense or other third-party advertising providers. Vendors, including Google, may use cookies to serve ads based on prior visits to this or other sites.",
      "You may be able to control personalized advertising through Google’s advertising settings and other consent or privacy controls. We do not control cookies independently operated by third-party advertisers.",
    ],
  },
  {
    id: "analytics",
    title: "Google Analytics and other analytics",
    icon: Scale,
    body: [
      "We may use Google Analytics or similar tools to understand visits, device information, approximate location, traffic source, and interactions. This helps us improve calculators and content. Provider privacy terms may also apply.",
    ],
  },
  {
    id: "use",
    title: "How we may use information",
    icon: RefreshCw,
    points: [
      "Operate and maintain the website",
      "Provide calculator functionality",
      "Respond to messages and feedback",
      "Improve calculators and content",
      "Understand website usage",
      "Fix technical problems",
      "Protect against abuse or fraud",
      "Measure performance and advertising",
      "Comply with legal requirements",
      "Enforce website terms",
    ],
    columns: 2,
  },
  {
    id: "third-parties",
    title: "Third-party services",
    icon: ExternalLink,
    body: ["The site may rely on third-party providers for functions such as:"],
    points: [
      "Website hosting",
      "Analytics",
      "Advertising",
      "Security",
      "Contact forms",
      "Content delivery",
      "Performance monitoring",
    ],
    columns: 3,
  },
  {
    id: "links",
    title: "External links",
    icon: ExternalLink,
    body: [
      "We may link to third-party websites. We are not responsible for their privacy practices, security, accuracy, or content. Visiting an external site is subject to that site’s own policies.",
    ],
  },
  {
    id: "retention-security",
    title: "Data retention and security",
    icon: LockKeyhole,
    body: [
      "Contact information may be retained as reasonably necessary to respond, keep records, prevent abuse, resolve disputes, or meet legal requirements. Third-party logs follow those providers’ policies.",
      "We take reasonable security steps, but no electronic transmission or storage is completely secure.",
    ],
  },
  {
    id: "children",
    title: "Children’s privacy",
    icon: Baby,
    body: [
      "This site is a general informational resource and is not designed to knowingly collect personal information from children in violation of applicable privacy laws. Contact us if you believe a child submitted information inappropriately.",
    ],
  },
  {
    id: "rights",
    title: "Privacy rights and consent",
    icon: ShieldCheck,
    body: [
      "Depending on where you live, you may have rights to request access, correction, deletion, restriction, or other controls. Scope depends on applicable law.",
      "Where required, we may provide consent controls for cookies, analytics, or personalized advertising. Contact us through Contact Us for privacy-related requests.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this Privacy Policy",
    icon: RefreshCw,
    body: [
      "We may update this policy when our website, technologies, advertising, legal requirements, or practices change. The “Last Updated” date at the top will be revised. Please review this page periodically.",
    ],
  },
];

export default function PrivacyView({ siteUrl }: { siteUrl: string }) {
  return (
    <LegalLayout
      siteUrl={siteUrl}
      page="privacy"
      path="/privacy-policy"
      crumb="Privacy Policy"
      eyebrow="Privacy Policy"
      icon={ShieldCheck}
      title="Privacy Policy"
      intro="This Privacy Policy explains how FitnessCalculatorPro.com handles information when you visit and use our website."
      updated="October 7, 2026"
      sections={sections}
      cta={{
        title: "Privacy questions?",
        text: (
          <>
            Contact us through the Contact Us page, or review our{" "}
            <Link href="/terms-and-conditions" className="content-link">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="content-link">
              Disclaimer
            </Link>
            .
          </>
        ),
      }}
    />
  );
}
