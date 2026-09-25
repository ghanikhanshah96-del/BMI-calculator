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
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BMI Wellness Pro handles calculator inputs, contact messages, cookies, and your privacy when using our free health calculators.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | BMI Wellness Pro",
    description:
      "Privacy information for BMI Wellness Pro health calculators and educational wellness content.",
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
    <div className="min-h-screen bg-background text-slate-900">
      <SiteHeader activePage="privacy" />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Privacy
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy policy
        </h1>
        <p className="prose-links mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          BMI Wellness Pro is built as a free health calculator suite. This page explains what happens to information when you use our tools or{" "}
          <Link href="/contact" className="content-link">contact us</Link>.
        </p>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 25, 2026</p>

        <div className="mt-10 space-y-8">
          {sections.map(({ id, title, icon: Icon, body }) => (
            <section
              key={id}
              id={id}
              className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              </div>
              <div className="mt-4 space-y-3 text-base leading-7 text-slate-600">
                {body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="prose-links mt-10 rounded-xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Need help?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            For privacy questions, send a message through our{" "}
            <Link href="/contact" className="content-link">Contact page</Link>. You can also review our{" "}
            <Link href="/terms" className="content-link">Terms of Use</Link> and return to the{" "}
            <Link href="/" className="content-link">home calculators</Link>.
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
