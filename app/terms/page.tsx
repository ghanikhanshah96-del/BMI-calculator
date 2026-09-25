import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  FileText,
  HeartPulse,
  Scale,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using BMI Wellness Pro free BMI, TDEE, body fat, macro, pregnancy due date, and ovulation calculators.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | BMI Wellness Pro",
    description:
      "Terms for using BMI Wellness Pro health calculators and educational wellness resources.",
    url: "/terms",
    type: "website",
  },
};

const sections = [
  {
    title: "Educational use",
    icon: BookOpenCheck,
    body: [
      "BMI Wellness Pro provides calculators and written guides for general education and personal planning.",
      "The site is not a diagnosis, prescription, treatment plan, or replacement for professional care.",
    ],
  },
  {
    title: "Calculator estimates",
    icon: FileText,
    body: [
      "BMI, TDEE, macro, body fat, due date, and ovulation results are estimates based on the values you enter.",
      "Outcomes can differ because of medical history, body composition, cycle variation, pregnancy details, training, medications, and lifestyle.",
    ],
  },
  {
    title: "Health decisions",
    icon: HeartPulse,
    body: [
      "Speak with a qualified clinician or dietitian before making medical decisions, changing medication, starting an intense diet, or relying on pregnancy and fertility estimates for urgent planning.",
      "Read each tool’s guide on our ",
    ],
    linkAfter: { href: "/blog", label: "Blog" },
    bodyAfter: " for method details and limits.",
  },
  {
    title: "Responsible use",
    icon: Scale,
    body: [
      "Do not misuse the site, interfere with availability, copy content unlawfully, or use results to pressure, shame, or diagnose another person.",
      "By using the site you agree to these terms and our ",
    ],
    linkAfter: { href: "/privacy", label: "Privacy Policy" },
    bodyAfter: ".",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-slate-900">
      <SiteHeader activePage="terms" />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          <FileText className="h-4 w-4" />
          Terms
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Terms of use
        </h1>
        <p className="prose-links mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          These terms cover how you may use BMI Wellness Pro, our free{" "}
          <Link href="/" className="content-link">health calculators</Link> and educational content.
        </p>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 25, 2026</p>

        <aside className="mt-8 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <p className="text-sm leading-6 text-slate-700">
            Calculator outputs can support planning, but urgent symptoms, pregnancy concerns, eating disorder risk, fertility questions, or medical conditions deserve professional guidance.
          </p>
        </aside>

        <div className="mt-10 space-y-8">
          {sections.map(({ title, icon: Icon, body, linkAfter, bodyAfter }) => (
            <section
              key={title}
              className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              </div>
              <div className="prose-links mt-4 space-y-3 text-base leading-7 text-slate-600">
                {body.map((paragraph, index) => (
                  <p key={`${title}-${index}`}>
                    {paragraph}
                    {index === body.length - 1 && linkAfter ? (
                      <>
                        <Link href={linkAfter.href} className="content-link">{linkAfter.label}</Link>
                        {bodyAfter}
                      </>
                    ) : null}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="prose-links mt-10 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Questions?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Reach us via the <Link href="/contact" className="content-link">Contact page</Link>, or open a calculator from the{" "}
            <Link href="/" className="content-link">home page</Link>.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-emerald-800"
          >
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
