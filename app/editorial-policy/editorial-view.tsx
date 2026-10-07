"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BookOpenCheck,
  Calculator,
  FileText,
  HeartPulse,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "../components/icons";
import LegalLayout, { type LegalSection } from "../components/legal-layout";

const sections: LegalSection[] = [
  {
    id: "mission",
    title: "Our editorial mission",
    icon: Target,
    body: [
      "We aim to help readers understand commonly used health and fitness calculations without unnecessary complexity. Our content is designed to:",
    ],
    points: [
      "Explain results in clear language",
      "Describe how calculations work",
      "Explain assumptions and limitations",
      "Provide educational context",
      "Distinguish estimates from diagnoses",
      "Encourage professional advice when needed",
    ],
    columns: 2,
  },
  {
    id: "methodology",
    title: "Calculator methodology",
    icon: Calculator,
    body: [
      "Whenever practical, calculators are based on established equations, published methods, or commonly accepted approaches. We do not present estimates as exact clinical measurements. Calculator pages may explain:",
    ],
    points: [
      "The formula or method used",
      "Information required from the user",
      "Assumptions in the calculation",
      "How results should be interpreted",
      "When estimates may be less accurate",
      "Relevant limitations",
    ],
    columns: 2,
  },
  {
    id: "research",
    title: "Research standards",
    icon: BookOpenCheck,
    body: ["When researching topics, we aim to rely on credible sources where appropriate, such as:"],
    points: [
      "Government health agencies",
      "Public health organizations",
      "Medical or scientific organizations",
      "Peer-reviewed research",
      "Professional guidelines",
      "Established formula sources",
      "Reputable academic institutions",
    ],
    columns: 2,
  },
  {
    id: "health",
    title: "Health and medical content",
    icon: HeartPulse,
    body: [
      "Health-related information requires particular care. Our content is educational and is not intended to diagnose, treat, cure, or prevent a medical condition. Where a formula cannot fully evaluate personal factors, we aim to make those limits clear.",
    ],
  },
  {
    id: "writing",
    title: "Writing standards",
    icon: FileText,
    points: [
      "Clear — ordinary readers can understand it",
      "Relevant — helps use the calculator or topic",
      "Transparent — assumptions and limits are visible",
      "Original — explanations are not copied wholesale",
      "Balanced — estimates are not guaranteed outcomes",
      "Useful — answers real user questions",
    ],
    columns: 2,
  },
  {
    id: "review",
    title: "Review and updating",
    icon: RefreshCw,
    body: ["We may review existing pages when:"],
    points: [
      "Relevant guidelines change",
      "New reliable information appears",
      "A formula needs revision",
      "An outdated reference is found",
      "A reader reports a possible error",
      "A calculator is significantly improved",
      "Extra clarification would help users",
    ],
    columns: 2,
  },
  {
    id: "corrections",
    title: "Corrections policy",
    icon: Scale,
    body: [
      "If a factual, calculation, technical, or typographical error is identified, we may investigate and correct it. Significant corrections may update formulas, logic, explanatory text, references, definitions, tables, examples, or warnings.",
      "When reporting a calculation error, include the calculator name and values used so we can reproduce the result.",
    ],
  },
  {
    id: "ai",
    title: "Artificial intelligence and editorial responsibility",
    icon: Sparkles,
    body: [
      "Automated or AI-assisted tools may support research organization, drafting, editing, formatting, or quality checks. Publication responsibility remains with FitnessCalculatorPro.com. Content should be reviewed for relevance, clarity, accuracy, and editorial standards before it is treated as final — especially for health-related information.",
    ],
  },
  {
    id: "ads",
    title: "Advertising and editorial independence",
    icon: ShieldCheck,
    body: ["Advertising does not determine:"],
    points: [
      "Calculator formulas",
      "Calculator results",
      "Positive or negative topic framing",
      "Interpretation of limitations",
      "Corrections to errors",
    ],
    columns: 2,
  },
  {
    id: "sponsored",
    title: "Sponsored content and affiliates",
    icon: FileText,
    body: [
      "If we publish sponsored content or use affiliate relationships in the future, we aim to disclose them where required. Commercial relationships should not be presented as independent editorial recommendations without appropriate disclosure.",
    ],
  },
  {
    id: "feedback",
    title: "User feedback",
    icon: Target,
    body: ["We welcome reports involving:"],
    points: [
      "Incorrect calculations",
      "Broken calculators",
      "Outdated information",
      "Missing context",
      "Unclear explanations",
      "Accessibility problems",
      "Typographical errors",
      "Suggestions to improve a tool",
    ],
    columns: 2,
  },
  {
    id: "limits",
    title: "Editorial limitations",
    icon: AlertTriangle,
    body: [
      <>
        Even carefully researched information may not apply equally to every person. Online calculators cannot account for
        every factor that affects an individual result. Treat our content as general education, not a substitute for
        professional evaluation. Also read our{" "}
        <Link href="/disclaimer" className="content-link">
          Disclaimer
        </Link>
        ,{" "}
        <Link href="/privacy-policy" className="content-link">
          Privacy Policy
        </Link>
        , and{" "}
        <Link href="/terms-and-conditions" className="content-link">
          Terms and Conditions
        </Link>
        .
      </>,
    ],
  },
];

export default function EditorialView({ siteUrl }: { siteUrl: string }) {
  return (
    <LegalLayout
      siteUrl={siteUrl}
      page="editorial-policy"
      path="/editorial-policy"
      crumb="Editorial Policy"
      eyebrow="Editorial Policy"
      icon={BookOpenCheck}
      title="Editorial Policy"
      intro="How FitnessCalculatorPro.com approaches calculator methodology, research, writing, reviewing, updating, corrections, and advertising independence."
      updated="October 7, 2026"
      sections={sections}
      cta={{
        title: "Contact the editorial team",
        text: (
          <>
            Found a possible error or have a suggestion? Send a message through Contact Us. Feedback helps us keep{" "}
            <Link href="/about-us" className="content-link">
              FitnessCalculatorPro.com
            </Link>{" "}
            clearer and more useful.
          </>
        ),
      }}
    />
  );
}
