"use client";

import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import { AlertTriangle, ArrowRight, BookOpenCheck, Calculator, Info, Lock, RefreshCw, Target } from "../components/icons";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { organizationRef, websiteRef } from "../lib/seo";
import { getToolLink, toolHref, type ToolId } from "../lib/tool-nav";

const ctaLink = "font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white";

const methods: { toolId: ToolId; method: string; source: string }[] = [
  {
    toolId: "bmi",
    method: "Weight in kilograms divided by height in meters squared, with adult categories from 16 to 40+.",
    source: "World Health Organization adult BMI classification.",
  },
  {
    toolId: "body-fat",
    method: "Circumference equations using height, neck, waist, and hip (women) measurements.",
    source: "U.S. Navy body fat method (Hodgdon and Beckett), with American Council on Exercise (ACE) categories.",
  },
  {
    toolId: "tdee",
    method: "Basal metabolic rate multiplied by a standard activity factor from 1.2 to 1.9.",
    source: "Mifflin-St Jeor equation, or Katch-McArdle when you enter body fat percentage.",
  },
  {
    toolId: "macro",
    method: "Goal-adjusted calories split into protein, carbohydrate, and fat using 4, 4, and 9 calories per gram.",
    source: "Mifflin-St Jeor or Katch-McArdle energy estimate with common macronutrient ratio presets.",
  },
  {
    toolId: "pregnancy",
    method: "280 days from the last period, 266 days from conception, or adjusted for ultrasound and IVF transfer dates.",
    source: "Naegele's rule and standard obstetric dating conventions.",
  },
  {
    toolId: "ovulation",
    method: "Ovulation estimated at cycle length minus 14 days, with a fertile window from five days before to one day after.",
    source: "Calendar method based on an average luteal phase of about 14 days.",
  },
];

const principles = [
  {
    icon: Target,
    title: "Our mission",
    text: "Health numbers are only useful when you understand them. We build fast, free calculators and pair every result with a plain-language explanation, so you can plan with confidence and know when to ask a professional.",
  },
  {
    icon: BookOpenCheck,
    title: "Published formulas only",
    text: "Every tool uses a formula that is published and widely used in clinical or fitness settings. We do not invent scoring systems, and each calculator page explains how its result is worked out.",
  },
  {
    icon: Lock,
    title: "Private by design",
    text: "Calculations run in your browser. We do not ask you to sign up, and the numbers you type into a calculator are not sent to our servers.",
  },
];

const reviewSteps = [
  "Each formula is checked against its original published source before a calculator goes live, and test values are compared with worked examples from that source.",
  "Guides are written in plain language, cite the organizations behind each method, and explain who a result may not apply to, such as athletes, older adults, or pregnant people.",
  "When a reader reports a possible error, we recheck the calculation first and publish a fix as soon as it is confirmed.",
  "Pages are reviewed when guidelines change, and the updated date on each guide shows when it was last revised.",
];

export default function AboutView({ siteUrl, description }: { siteUrl: string; description: string }) {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    name: "About FitnessCalculatorPro.com",
    url: `${siteUrl}/about`,
    description,
    inLanguage: "en-US",
    isPartOf: websiteRef(siteUrl),
    mainEntity: organizationRef(siteUrl),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="about" />
      <PageHero
        image="/images/overview-wellness.jpg"
        imageAlt="Woman meditating outdoors at sunrise"
        eyebrow="About us"
        icon={Info}
        title="About FitnessCalculatorPro.com"
        description={
          <p>
            Free, science-based fitness and health calculators with clear explanations. Here is why we built them, how they
            work, and where our formulas come from.
          </p>
        }
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: "About", href: "/about" }]} />
      </PageHero>

      <main className="page-main section-block">
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <Reveal as="section" key={title} delay={index * 90}>
              <div className="card-surface h-full p-6">
                <span className="icon-badge h-11 w-11 rounded-xl">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-xl text-slate-900">{title}</h2>
                <p className="muted-copy mt-2">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <section aria-labelledby="methodology" className="section-gap">
          <div className="flex items-center gap-3">
            <span className="icon-badge h-10 w-10 rounded-xl">
              <Calculator className="h-5 w-5" />
            </span>
            <h2 id="methodology" className="section-title">
              How our calculators work
            </h2>
          </div>
          <p className="body-copy mt-3">
            Each tool below links to its own page, where you will find step-by-step instructions, a guide to reading your
            result, and answers to common questions.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {methods.map(({ toolId, method, source }, index) => {
              const tool = getToolLink(toolId);
              return (
                <Reveal as="li" key={toolId} delay={(index % 2) * 80}>
                <div className="card-surface flex h-full gap-4 p-5">
                  <span className="icon-badge h-10 w-10 flex-none rounded-xl">
                    <tool.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold">
                      <Link href={toolHref(tool)} className="underline-offset-2 hover:text-emerald-800 hover:underline">
                        {tool.name}
                      </Link>
                    </h3>
                    <p className="muted-copy mt-1">{method}</p>
                    <p className="mt-2 text-xs leading-5 text-emerald-800">
                      <span className="font-semibold">Source:</span> {source}
                    </p>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </ul>
        </section>

        <div className="section-gap grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="review" className="card-surface p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="icon-badge h-10 w-10 rounded-xl">
                <RefreshCw className="h-5 w-5" />
              </span>
              <h2 id="review" className="section-title">
                How we check and update content
              </h2>
            </div>
            <ol className="body-copy mt-5 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-emerald-700">
              {reviewSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="limits" className="card-surface p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="icon-badge h-10 w-10 rounded-xl">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h2 id="limits" className="section-title">
                Limits of every estimate
              </h2>
            </div>
            <div className="mt-5">
              <p className="body-copy">
                Our calculators give educational estimates, not a diagnosis or treatment plan. Results can differ because of
                medical history, body composition, medication, pregnancy details, and cycle variation. Speak with a doctor,
                midwife, or registered dietitian before making medical decisions. Read the full{" "}
                <Link href="/terms" className="content-link">
                  terms of use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="content-link">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </section>
        </div>

        <aside className="cta-panel mt-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="cta-glow" />
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl text-white">Spotted an error or have a suggestion?</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50 sm:text-base">
              We review every message about accuracy. You can also browse{" "}
              <Link href="/calculators" className={ctaLink}>
                all health calculators
              </Link>{" "}
              or read our{" "}
              <Link href="/blog" className={ctaLink}>
                calculator guides
              </Link>
              .
            </p>
          </div>
          <Link href="/contact" className="group cta-button shrink-0 lg:mt-0">
            Contact us <ArrowRight className="arrow-nudge" />
          </Link>
        </aside>
      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
    </div>
  );
}
