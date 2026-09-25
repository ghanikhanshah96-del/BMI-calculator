import type { Metadata } from "next";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact BMI Wellness Pro with questions about our BMI, TDEE, macro, body fat, pregnancy, and ovulation calculators.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | BMI Wellness Pro",
    description:
      "Send a message to the BMI Wellness Pro team about our free health calculators.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-slate-900">
      <SiteHeader activePage="contact" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Questions about the calculators, feedback, or partnership ideas? Send a short message and we will reply by email.
          </p>
        </div>
        <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
