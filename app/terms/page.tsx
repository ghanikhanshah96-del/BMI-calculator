import {
  AlertCircle,
  BookOpenCheck,
  FileText,
  HeartPulse,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Terms of Use | BMI Wellness Pro",
  description:
    "Review the terms for using BMI Wellness Pro calculators, educational health content, and wellness estimates.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Use | BMI Wellness Pro",
    description:
      "Terms for using BMI Wellness Pro health calculators and educational wellness resources.",
    url: "/terms",
    siteName: "BMI Wellness Pro",
    type: "website",
  },
};

const termsSections = [
  {
    title: "Educational use",
    icon: BookOpenCheck,
    text:
      "BMI Wellness Pro provides calculators and written content for general education, wellness planning, and personal organization. It is not a diagnosis, prescription, treatment plan, or replacement for professional care.",
  },
  {
    title: "Calculator estimates",
    icon: FileText,
    text:
      "BMI, TDEE, macro, body fat, due date, and ovulation outputs are estimates based on the values you enter. Real-world results can vary because of medical history, body composition, cycle variation, pregnancy details, training, medications, and lifestyle factors.",
  },
  {
    title: "Health decisions",
    icon: HeartPulse,
    text:
      "Speak with a qualified clinician, dietitian, or relevant professional before making medical decisions, changing medication, starting an intense diet, or using pregnancy and fertility estimates for urgent planning.",
  },
  {
    title: "Responsible use",
    icon: ShieldCheck,
    text:
      "Do not misuse the site, interfere with availability, copy content in a way that violates rights, or use calculator results to pressure, shame, or diagnose another person.",
  },
];

const limitations = [
  "The site may change content, features, design, or availability over time.",
  "No calculator can account for every personal health variable.",
  "The site is provided without a guarantee that every result is complete, current, or suitable for a specific medical situation.",
  "External links, if added, are provided for convenience and may have separate policies.",
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-emerald-50 text-slate-950">
      <SiteHeader activePage="terms" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
              <FileText className="h-4 w-4" />
              Terms of use
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Simple terms for using BMI Wellness Pro.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              These terms explain the educational purpose of the site, the limits of health estimates, and the responsibilities that come with using wellness content.
            </p>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5">
            <AlertCircle className="h-8 w-8 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Important health notice
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Calculator outputs can support planning, but urgent symptoms, pregnancy concerns, eating disorder risk, fertility questions, or medical conditions deserve professional guidance.
            </p>
          </aside>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-2">
          {termsSections.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-7 w-7 text-emerald-700" />
              <h2 className="mt-4 text-2xl font-black text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 py-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-emerald-700 p-6 text-white">
            <Scale className="h-8 w-8" />
            <h2 className="mt-5 text-3xl font-black">Use estimates with care</h2>
            <p className="mt-4 leading-7 text-emerald-50">
              A number can be useful without being final. The healthiest next step is often to compare the result with your trend, symptoms, habits, and professional advice.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Limitations</h2>
            <div className="mt-5 grid gap-3">
              {limitations.map((item) => (
                <div key={item} className="rounded-lg bg-emerald-50 p-4 font-semibold leading-6 text-slate-700">
                  {item}
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
