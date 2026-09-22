import {
  ClipboardCheck,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy | BMI Wellness Pro",
  description:
    "Learn how BMI Wellness Pro handles calculator inputs, technical data, cookies, and privacy for health calculator users.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | BMI Wellness Pro",
    description:
      "Privacy information for BMI Wellness Pro health calculators and educational wellness content.",
    url: "/privacy",
    siteName: "BMI Wellness Pro",
    type: "website",
  },
};

const privacySections = [
  {
    title: "Calculator inputs",
    icon: ClipboardCheck,
    text:
      "BMI, height, weight, calorie, macro, pregnancy, and ovulation values are used to calculate results on the page. The site is designed as an educational calculator experience, not a medical record system.",
  },
  {
    title: "Personal information",
    icon: Database,
    text:
      "If a contact form, email link, analytics service, or hosting provider is added later, only the information needed to operate the site and respond to requests should be collected.",
  },
  {
    title: "Cookies and analytics",
    icon: LockKeyhole,
    text:
      "The core calculator experience does not need account cookies. If analytics are enabled, they should be used to understand page performance and popular content, not to sell sensitive health profiles.",
  },
  {
    title: "Health privacy",
    icon: ShieldCheck,
    text:
      "Health-related numbers can feel personal. Avoid entering information that you would not want visible on a shared device, browser history, or public screen.",
  },
];

const userChoices = [
  "Use private browsing on shared devices.",
  "Clear browser history if health searches are sensitive.",
  "Do not treat calculator outputs as a diagnosis.",
  "Contact a qualified professional for personal medical decisions.",
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-emerald-50 text-slate-950">
      <SiteHeader activePage="privacy" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Privacy policy
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Clear privacy for a health calculator site.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              This page explains how health calculator inputs, technical data, and communication details should be handled when you use BMI Wellness Pro.
            </p>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5">
            <LockKeyhole className="h-8 w-8 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Privacy-friendly by design
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              The calculators are intended to be quick educational tools. You can use them without creating an account or saving a profile.
            </p>
          </aside>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-2">
          {privacySections.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-7 w-7 text-emerald-700" />
              <h2 className="mt-4 text-2xl font-black text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 py-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-emerald-700 p-6 text-white">
            <Mail className="h-8 w-8" />
            <h2 className="mt-5 text-3xl font-black">Questions about privacy</h2>
            <p className="mt-4 leading-7 text-emerald-50">
              If contact details are added to the website, privacy requests should be answered with enough clarity for users to understand what data exists and why.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Your choices</h2>
            <div className="mt-5 grid gap-3">
              {userChoices.map((choice) => (
                <div key={choice} className="rounded-lg bg-emerald-50 p-4 font-semibold text-slate-700">
                  {choice}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
