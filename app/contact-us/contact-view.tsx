"use client";

import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import FaqAccordion from "../components/faq-accordion";
import HeroBackdrop from "../components/hero-backdrop";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import ContactForm from "./contact-form";

const contactTopics = [
  "How a calculator works",
  "A result that looks incorrect",
  "Technical problems",
  "Broken links or display issues",
  "Typos or factual errors",
  "Outdated information",
  "Suggestions for new calculators",
  "Improvements to existing tools",
  "Accessibility issues",
  "General feedback",
  "Advertising or partnership inquiries",
];

const errorTips = [
  "The URL or name of the affected page",
  "A short explanation of the issue",
  "Values you entered (for calculator issues)",
  "What you expected to see",
  "What appeared instead",
];

const faqs = [
  {
    question: "How quickly will I get a reply?",
    answer:
      "Most messages receive a reply within one to two business days. Questions about a possible calculation error are prioritized because they may affect other visitors.",
  },
  {
    question: "Can you give me personal medical or nutrition advice?",
    answer:
      "No. FitnessCalculatorPro.com provides general educational information and estimated calculations. We cannot diagnose conditions, interpret medical records, or provide individualized medical, nutrition, pregnancy, or fertility advice.",
  },
  {
    question: "What should I include when reporting an error?",
    answer:
      "Include the page URL or calculator name, a short description of the issue, the values you entered, what you expected, and what you saw instead. We review reasonable correction requests and update content when appropriate.",
  },
  {
    question: "Should I send confidential health information?",
    answer:
      "Please do not send confidential medical records, identification documents, passwords, payment information, or other highly sensitive information through the contact form.",
  },
  {
    question: "Can I suggest a new calculator?",
    answer:
      "Yes. Tell us what you want to calculate and why it would help. Suggestions that many people ask for, and that rely on a published, well-supported method, are the most likely to be added.",
  },
];

export default function ContactView({ siteUrl }: { siteUrl: string }) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="contact" />
      <div className="relative isolate flex flex-1 flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[46rem]" aria-hidden="true">
          <HeroBackdrop image="/images/contact.jpg" imageAlt="" />
        </div>

        <main className="page-main section-block relative z-10">
          <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Contact Us", href: "/contact-us" }]} />

          <ContactForm />

          <div className="content-readable mt-10">
          <header>
            <h1 className="hero-title">Contact Us</h1>
            <p className="hero-copy">
              Thank you for visiting FitnessCalculatorPro.com. Send feedback about calculators, guides, corrections,
              accessibility, or ideas for new tools.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              We typically reply within 1–2 business days. Your message is used to respond to you — see our{" "}
              <Link href="/privacy-policy" className="content-link">
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
          </header>

          <div className="mt-10 divide-y divide-slate-200">
            <section className="pb-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                What you can contact us about
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                When reporting a calculator problem, mention the calculator, values entered, unit system, and the result
                you received.
              </p>
              <ul className="mt-4 grid list-disc gap-x-10 gap-y-2 pl-5 text-base leading-7 text-slate-600 marker:text-emerald-700 sm:grid-cols-2 lg:grid-cols-3">
                {contactTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Medical and personal health
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                We cannot diagnose conditions, interpret personal medical records, recommend treatment, or provide
                individualized medical, nutrition, pregnancy, or fertility advice. For personal health questions, contact
                a qualified healthcare professional.
              </p>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Reporting an error</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Accuracy matters to us. If you believe a calculator, formula, article, or guide contains an error, please
                include:
              </p>
              <ul className="mt-4 grid list-disc gap-x-10 gap-y-2 pl-5 text-base leading-7 text-slate-600 marker:text-emerald-700 sm:grid-cols-2 lg:grid-cols-3">
                {errorTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Looking for answers first?</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Read our{" "}
                <Link href="/blog" className="content-link">
                  calculator guides
                </Link>{" "}
                or the{" "}
                <Link href="/about-us" className="content-link">
                  About Us
                </Link>{" "}
                page for methodology and sources.
              </p>
            </section>

            <section className="pt-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Contact FAQ</h2>
              <FaqAccordion items={faqs} className="mt-5" />
            </section>
          </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
