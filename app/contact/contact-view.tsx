"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import FaqAccordion from "../components/faq-accordion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calculator,
  Clock,
  FileText,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "../components/icons";
import PageHero from "../components/page-hero";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import ContactForm from "./contact-form";
import "./contact.css";

const infoCards = [
  {
    icon: Clock,
    title: "Quick replies",
    text: "We typically respond within 1–2 business days.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Your message is only used to reply to you — never sold or shared.",
  },
  {
    icon: Mail,
    title: "Feedback welcome",
    text: "Ideas for new calculators or clearer guides are always appreciated.",
  },
];

const topics = [
  {
    icon: Calculator,
    title: "Questions about a calculator",
    text: "Not sure which inputs to use, or what a BMI, TDEE, body fat, macro, due date, or ovulation result means? Ask and we will point you to the right explanation.",
  },
  {
    icon: AlertCircle,
    title: "A result that looks wrong",
    text: "If a number seems off, tell us which calculator you used, the values you entered, and the unit system. We recheck the formula and fix any bug we find.",
  },
  {
    icon: FileText,
    title: "Corrections to a guide",
    text: "Spotted an outdated reference, a typo, or an unclear sentence in one of our guides? Send the page link and the passage so we can review it.",
  },
  {
    icon: Sparkles,
    title: "Ideas and partnerships",
    text: "Suggest a new calculator, share accessibility feedback, or ask about working together. Every request is read by a person.",
  },
];

const nextSteps = [
  "You send a short message with the page and details.",
  "A person who maintains the calculators reads it.",
  "You get an email reply within 1–2 business days.",
];

const tips = [
  "The name of the calculator or guide your message is about.",
  "The inputs you used and whether you chose metric or US units.",
  "Your device and browser if something did not display or work correctly.",
  "A short description of what you expected to see and what you saw instead.",
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
      "No. Our calculators and guides are educational and cannot replace a doctor, midwife, or registered dietitian who knows your health history. We are happy to explain how a formula works or what a result category means.",
  },
  {
    question: "Do you store the numbers I type into the calculators?",
    answer:
      "No. Calculations run in your browser, and your inputs are not sent to our servers. Only the details you choose to send through this contact form are received, and they are used solely to answer you.",
  },
  {
    question: "Should I include health details in my message?",
    answer:
      "Only what is needed to answer your question. For a calculation check, the values you entered are enough; please do not send medical records or other sensitive documents.",
  },
  {
    question: "Can I suggest a new calculator?",
    answer:
      "Yes. Tell us what you want to calculate and why it would help. Suggestions that many people ask for, and that rely on a published, well-supported formula, are the most likely to be added.",
  },
  {
    question: "How do I report a bug or an accessibility problem?",
    answer:
      "Tell us the page, what you tried, and the device and browser you used. Accessibility reports, such as a control that does not work with a keyboard or screen reader, are treated as a priority and fixed as quickly as possible.",
  },
];

export default function ContactView({ siteUrl }: { siteUrl: string }) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="contact" />
      <PageHero
        image="/images/contact.jpg"
        imageAlt="Hands typing a message on a laptop"
        eyebrow="Contact"
        icon={MessageCircle}
        title="Get in touch"
        description="Questions about the calculators, feedback, or partnership ideas? Send a short message and we will reply by email."
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Contact", href: "/contact" }]} />
      </PageHero>
      <main className="page-main section-block">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <ContactForm />

          <aside className="grid gap-5">
            <div className="group relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl shadow-emerald-900/15 ring-1 ring-slate-900/5">
              <Image
                src="/images/overview-wellness.jpg"
                alt="Woman meditating at sunrise"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="img-zoom"
              />
              <div className="absolute inset-0 bg-linear-to-t from-emerald-950/85 via-emerald-900/20 to-transparent" />
              <p className="absolute inset-x-5 bottom-5 font-display text-xl leading-snug text-white">
                Small, steady steps add up to lasting health.
              </p>
            </div>

            {infoCards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="spotlight group card-lift card-surface flex items-start gap-4 p-5">
                <span className="icon-badge h-11 w-11 flex-none rounded-xl">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="muted-copy mt-1">{text}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>

        <section aria-labelledby="contact-topics" className="section-gap ct-topics">
          <div className="ct-intro">
            <h2 id="contact-topics" className="section-title">
              What we can help with
            </h2>
            <p className="body-copy mt-3">
              FitnessCalculatorPro.com is a small, independent project. Messages go straight to the people who write the
              guides and maintain the calculators, so the more specific you are, the faster we can help.
            </p>
            <div className="ct-next">
              <p className="ct-next-title">What happens next</p>
              <ol className="ct-steps">
                {nextSteps.map((step) => (
                  <li key={step} className="ct-step">
                    {step}
                  </li>
                ))}
              </ol>
              <a href="#contact-form" className="group ct-next-link">
                Write your message
                <ArrowRight className="arrow-nudge" />
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map(({ icon: Icon, title, text }) => (
              <article key={title} className="spotlight group ct-topic">
                <span className="ct-icon">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="ct-topic-title">{title}</h3>
                <p className="muted-copy mt-2">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-tips" className="section-gap ct-tips">
          <div className="ct-checklist-panel">
            <h2 id="contact-tips" className="section-title">
              What to include in your message
            </h2>
            <ol className="ct-checklist">
              {tips.map((tip) => (
                <li key={tip} className="ct-check">
                  {tip}
                </li>
              ))}
            </ol>
          </div>
          <div className="group ct-cta">
            <span className="ct-icon">
              <BookOpen className="h-5 w-5" />
            </span>
            <p className="ct-cta-title">Looking for answers first?</p>
            <p className="muted-copy mt-2">
              Every tool has an in-depth explanation in our{" "}
              <Link href="/blog" className="content-link">
                calculator guides
              </Link>
              , and the{" "}
              <Link href="/about" className="content-link">
                methodology page
              </Link>{" "}
              lists the formula and source behind each result.
            </p>
          </div>
        </section>

        <section aria-labelledby="contact-faq" className="section-gap ct-faq">
          <h2 id="contact-faq" className="section-title">
            Contact FAQ
          </h2>
          <FaqAccordion items={faqs} variant="list" className="mt-5" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
