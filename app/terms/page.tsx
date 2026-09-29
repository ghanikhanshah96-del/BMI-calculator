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
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using FitnessCalculatorPro.com free BMI, TDEE, body fat, macro, pregnancy due date, and ovulation calculators.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | FitnessCalculatorPro.com",
    description:
      "Terms for using FitnessCalculatorPro.com health calculators and educational wellness resources.",
    url: "/terms",
    type: "website",
  },
};

const sections = [
  {
    title: "Educational use",
    icon: BookOpenCheck,
    body: [
      "FitnessCalculatorPro.com provides calculators and written guides for general education and personal planning.",
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

function toId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function TermsPage() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="terms" />
      <PageHero
        image="/images/legal.jpg"
        imageAlt="Stethoscope resting on a white sheet"
        eyebrow="Terms"
        icon={FileText}
        title="Terms of use"
        description={
          <>
            <p>
              These terms cover how you may use FitnessCalculatorPro.com, our free health calculators and educational content.
            </p>
            <p className="mt-3 text-sm text-emerald-100">Last updated: September 25, 2026</p>
          </>
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">On this page</p>
              <ul className="mt-4 space-y-1 text-sm">
                {sections.map(({ title }) => (
                  <li key={title}>
                    <a
                      href={`#${toId(title)}`}
                      className="block rounded-lg border-l-2 border-transparent px-3 py-2 text-slate-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="max-w-3xl">
            <aside className="flex gap-4 rounded-2xl border border-amber-200/70 bg-linear-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/30">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <p className="text-sm leading-6 text-slate-700">
                Calculator outputs can support planning, but urgent symptoms, pregnancy concerns, eating disorder risk, fertility questions, or medical conditions deserve professional guidance.
              </p>
            </aside>

            <div className="mt-6 space-y-6">
              {sections.map(({ title, icon: Icon, body, linkAfter, bodyAfter }, sectionIndex) => (
                <Reveal key={title} id={toId(title)} as="section" delay={sectionIndex * 80} className="scroll-mt-28">
                  <div className="spotlight group card-lift rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
                    <div className="flex items-center gap-4">
                      <span className="icon-badge h-11 w-11 flex-none rounded-xl">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-2xl text-slate-900">{title}</h2>
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
                  </div>
                </Reveal>
              ))}
            </div>

            <aside className="relative isolate mt-10 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl shadow-emerald-900/20 sm:p-10">
              <div className="absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_65%)]" />
              <h2 className="text-2xl text-white">Questions?</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50 sm:text-base">
                Reach us via the Contact page, or open a calculator from the{" "}
                <Link href="/" className="font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
                  home page
                </Link>
                .
              </p>
              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Contact us <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
