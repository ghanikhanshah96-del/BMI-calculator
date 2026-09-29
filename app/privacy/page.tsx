import {
  ArrowRight,
  Cookie,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FitnessCalculatorPro.com handles calculator inputs, contact messages, cookies, and your privacy when using our free health calculators.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | FitnessCalculatorPro.com",
    description:
      "Privacy information for FitnessCalculatorPro.com health calculators and educational wellness content.",
    url: "/privacy",
    type: "website",
  },
};

const sections = [
  {
    id: "calculator-inputs",
    title: "Calculator inputs",
    icon: Database,
    body: [
      "BMI, height, weight, calorie, macro, pregnancy, and ovulation values are processed in your browser to show results on the page.",
      "We do not require an account to use the calculators, and these numbers are not stored as a medical record.",
    ],
  },
  {
    id: "contact-messages",
    title: "Contact messages",
    icon: Mail,
    body: [
      "If you use the Contact page, we receive the name, email, and message you submit so we can reply.",
      "That information is used only to respond to your request and improve support—not to sell health profiles.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    icon: Cookie,
    body: [
      "The core calculator experience does not need login cookies.",
      "If analytics are enabled later, they would measure page performance and popular content—not create a sellable health dossier.",
    ],
  },
  {
    id: "your-choices",
    title: "Your choices",
    icon: LockKeyhole,
    body: [
      "Use private browsing on shared devices and clear history if health searches feel sensitive.",
      "Avoid entering information you would not want visible on a public screen.",
      "Calculator outputs are educational estimates—not a diagnosis.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="privacy" />
      <PageHero
        image="/images/legal.jpg"
        imageAlt="Stethoscope resting on a white sheet"
        eyebrow="Privacy"
        icon={ShieldCheck}
        title="Privacy policy"
        description={
          <>
            <p>
              FitnessCalculatorPro.com is built as a free health calculator suite. This page explains what happens to information when you use our tools or contact us.
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
                {sections.map(({ id, title }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
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
            <div className="space-y-6">
              {sections.map(({ id, title, icon: Icon, body }, index) => (
                <Reveal key={id} id={id} as="section" delay={index * 80} className="scroll-mt-28">
                  <div className="spotlight group card-lift rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
                    <div className="flex items-center gap-4">
                      <span className="icon-badge h-11 w-11 flex-none rounded-xl">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-2xl text-slate-900">{title}</h2>
                    </div>
                    <div className="mt-4 space-y-3 text-base leading-7 text-slate-600">
                      {body.map((paragraph) => (
                        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <aside className="relative isolate mt-10 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl shadow-emerald-900/20 sm:p-10">
              <div className="absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_65%)]" />
              <h2 className="text-2xl text-white">Need help?</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50 sm:text-base">
                For privacy questions, send a message through our Contact page. You can also review our{" "}
                <Link href="/terms" className="font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
                  Terms of Use
                </Link>{" "}
                or return to the{" "}
                <Link href="/" className="font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
                  home calculators
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
