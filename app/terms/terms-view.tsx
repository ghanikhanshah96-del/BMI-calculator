"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BookOpenCheck,
  CalendarHeart,
  ExternalLink,
  FileText,
  HeartPulse,
  RefreshCw,
  Scale,
  ShieldCheck,
} from "../components/icons";
import LegalLayout, { type LegalSection } from "../components/legal-layout";

const ctaLink = "font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white";

const sections: LegalSection[] = [
  {
    id: "educational-use",
    title: "Educational use",
    icon: BookOpenCheck,
    body: [
      "FitnessCalculatorPro.com provides free calculators and written guides for general education and personal planning.",
      "Nothing on the site is a diagnosis, prescription, treatment plan, or replacement for care from a qualified professional who knows your health history.",
    ],
  },
  {
    id: "calculator-estimates",
    title: "Calculator estimates",
    icon: FileText,
    body: [
      "BMI, TDEE, macro, body fat, due date, and ovulation results are estimates calculated from the values you enter and the published formulas described on each tool page.",
      "Real outcomes can differ because of medical history, body composition, cycle variation, pregnancy details, training, medications, and lifestyle. A small change in an input can also change the result, so double-check what you type.",
    ],
  },
  {
    id: "health-decisions",
    title: "Health decisions",
    icon: HeartPulse,
    body: [
      "Speak with a doctor or registered dietitian before making medical decisions, changing medication, starting a restrictive diet, or beginning an intense training plan.",
      <>
        Each tool links to an in-depth guide on our <Link href="/blog" className="content-link">Blog</Link> that
        explains the method and its limits.
      </>,
    ],
  },
  {
    id: "pregnancy-fertility",
    title: "Pregnancy and fertility estimates",
    icon: CalendarHeart,
    body: [
      "The due date and ovulation calculators give typical estimates based on average cycle patterns. Only about one in twenty babies arrives on the estimated due date, and ovulation can shift from cycle to cycle.",
      "Do not use these tools as a method of contraception or as a substitute for prenatal care. Contact your midwife, obstetrician, or doctor about any pregnancy or fertility concern.",
    ],
  },
  {
    id: "accuracy",
    title: "Accuracy and availability",
    icon: ShieldCheck,
    body: [
      "We work to keep every formula, reference, and explanation accurate and up to date, and we correct errors when they are reported. Even so, the site is provided as is, without any warranty that it will be error-free or always available.",
      "We may update, improve, or remove calculators and guides at any time.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Content and intellectual property",
    icon: Scale,
    body: [
      "The text, design, graphics, and code on FitnessCalculatorPro.com belong to us or our licensors. You may share links to any page and quote short passages with a link back to the source.",
      "Please do not copy whole guides, republish calculators, or scrape the site without written permission.",
    ],
  },
  {
    id: "external-links",
    title: "Links to other websites",
    icon: ExternalLink,
    body: [
      "Guides may reference outside organizations and research. We are not responsible for the content, accuracy, or privacy practices of websites we do not control.",
    ],
  },
  {
    id: "responsible-use",
    title: "Responsible use",
    icon: AlertTriangle,
    body: [
      "Do not misuse the site, interfere with its availability, attempt to access systems you are not authorized to use, or use results to pressure, shame, or diagnose another person.",
      "To the fullest extent permitted by law, we are not liable for any loss or harm arising from the use of, or reliance on, the calculators or content.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    icon: RefreshCw,
    body: [
      <>
        We may revise these terms as the site evolves, and the date at the top of this page shows the latest update. By
        continuing to use the site you agree to the current terms and our{" "}
        <Link href="/privacy" className="content-link">
          Privacy Policy
        </Link>
        .
      </>,
    ],
  },
];

export default function TermsView({ siteUrl }: { siteUrl: string }) {
  return (
    <LegalLayout
      siteUrl={siteUrl}
      page="terms"
      path="/terms"
      crumb="Terms of Use"
      eyebrow="Terms"
      icon={FileText}
      title="Terms of use"
      intro="These terms explain how you may use FitnessCalculatorPro.com, our free health calculators, and our educational guides. Please read them before relying on any result."
      updated="September 30, 2026"
      notice={
        <aside className="flex gap-4 rounded-2xl border border-amber-200/70 bg-linear-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/30">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <p className="text-sm leading-6 text-slate-700">
            Calculator outputs can support planning, but urgent symptoms, pregnancy concerns, eating disorder risk,
            fertility questions, or medical conditions deserve professional guidance.
          </p>
        </aside>
      }
      sections={sections}
      cta={{
        title: "Questions?",
        text: (
          <>
            Reach us through the Contact page, or browse{" "}
            <Link href="/calculators" className={ctaLink}>
              all health calculators
            </Link>
            .
          </>
        ),
      }}
    />
  );
}
