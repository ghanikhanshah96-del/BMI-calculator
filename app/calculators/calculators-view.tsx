"use client";

import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import { ArrowRight, LayoutGrid } from "../components/icons";
import PageHero from "../components/page-hero";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import ToolClusterGrid, { type GuideLinks } from "../components/tool-cards";
import { getToolLink, toolHref, toolLinks, type ToolId } from "../lib/tool-nav";

const choosingTips: { question: string; answer: string; toolId: ToolId }[] = [
  {
    question: "Want a quick weight check?",
    answer: "Start with the BMI calculator, then add a body fat estimate if you lift weights or have a muscular build.",
    toolId: "bmi",
  },
  {
    question: "Planning to lose or gain weight?",
    answer: "Find your maintenance calories with the TDEE calculator, then turn a goal into daily grams with the macro calculator.",
    toolId: "tdee",
  },
  {
    question: "Trying to conceive or already pregnant?",
    answer: "Use the ovulation calculator to time your fertile window, and the due date calculator once you have a positive test.",
    toolId: "ovulation",
  },
];

const reference: { toolId: ToolId; measures: string; bestFor: string }[] = [
  {
    toolId: "bmi",
    measures: "Weight relative to height, sorted into WHO adult categories.",
    bestFor: "A fast screening check and a healthy weight range for your height.",
  },
  {
    toolId: "body-fat",
    measures: "The share of your weight that is fat, from a few tape measurements.",
    bestFor: "Tracking body composition when the scale alone is misleading.",
  },
  {
    toolId: "tdee",
    measures: "Calories burned per day, from resting metabolism plus activity.",
    bestFor: "Setting maintenance, fat loss, or muscle gain calorie targets.",
  },
  {
    toolId: "macro",
    measures: "Daily grams of protein, carbohydrate, and fat for a calorie goal.",
    bestFor: "Turning a calorie target into meals you can actually plan.",
  },
  {
    toolId: "pregnancy",
    measures: "Estimated due date and gestational age, counted from 40 weeks.",
    bestFor: "Knowing your current week, trimester, and upcoming milestones.",
  },
  {
    toolId: "ovulation",
    measures: "Likely ovulation day and the fertile window in each cycle.",
    bestFor: "Planning when to try to conceive or when to take a pregnancy test.",
  },
];

export default function CalculatorsView({
  siteUrl,
  title,
  guides,
}: {
  siteUrl: string;
  title: string;
  guides: GuideLinks;
}) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: toolLinks.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteUrl}${toolHref(tool)}`,
    })),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="all-tools" />
      <PageHero
        image="/images/tools-bg.jpg"
        imageAlt="Colorful salad bowl with avocado, chickpeas, tomatoes, and sweet potato"
        eyebrow="Calculator hub"
        icon={LayoutGrid}
        title={title}
        description={
          <p>
            Six free tools for weight, energy, and pregnancy planning. Pick a calculator below, or read the matching guide
            to understand how each result is worked out.
          </p>
        }
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Calculators", href: "/calculators" }]} />
      </PageHero>

      <main className="page-main section-block">
        <ToolClusterGrid tone="light" headingLevel="h2" guides={guides} />

        <section aria-labelledby="choose-tool" className="section-gap">
          <h2 id="choose-tool" className="section-title">
            Which calculator should you use?
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {choosingTips.map((tip) => {
              const tool = getToolLink(tip.toolId);
              return (
                <article key={tip.question} className="card-surface flex flex-col p-6">
                  <h3 className="text-lg font-semibold">{tip.question}</h3>
                  <p className="muted-copy mt-2">{tip.answer}</p>
                  <Link
                    href={toolHref(tool)}
                    className="group mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-emerald-700"
                  >
                    Open the {tool.name}
                    <ArrowRight className="arrow-nudge" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="quick-reference" className="section-gap">
          <h2 id="quick-reference" className="section-title">
            What each result tells you
          </h2>
          <p className="body-copy mt-3 max-w-3xl">
            Every calculator answers a different question. Use this quick reference to see what a tool measures and when
            it is most useful, then open the tool page for step-by-step instructions and a guide to reading your result.
          </p>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            {reference.map((row) => {
              const tool = getToolLink(row.toolId);
              return (
                <div key={row.toolId} className="card-surface p-5">
                  <dt className="font-semibold">
                    <Link href={toolHref(tool)} className="hover:text-emerald-800">
                      {tool.name}
                    </Link>
                  </dt>
                  <dd className="muted-copy mt-1">
                    <span className="font-medium text-slate-700">Measures:</span> {row.measures}
                  </dd>
                  <dd className="muted-copy mt-1">
                    <span className="font-medium text-slate-700">Best for:</span> {row.bestFor}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        <section aria-labelledby="how-built" className="card-surface section-gap p-6 sm:p-8">
          <h2 id="how-built" className="section-title">
            How these calculators are built
          </h2>
          <div className="mt-3 grid gap-x-10 gap-y-3 lg:grid-cols-2">
            <p className="body-copy">
              Each tool uses a published, widely used formula, such as the WHO adult BMI categories, the Mifflin-St Jeor
              energy equation, the U.S. Navy circumference method, and Naegele&apos;s rule for due dates. Results appear
              instantly in metric or US units, and every calculation runs in your browser, so nothing you enter is
              stored.
            </p>
            <p className="body-copy">
              Results are educational estimates rather than a diagnosis. See{" "}
              <Link href="/about" className="content-link">
                how our calculators work
              </Link>{" "}
              for the full list of formulas and sources.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </div>
  );
}
