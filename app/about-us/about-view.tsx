"use client";

import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import { Info } from "../components/icons";
import PageHero from "../components/page-hero";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { organizationRef, websiteRef } from "../lib/seo";
import { getToolLink, toolHref, type ToolId } from "../lib/tool-nav";

const offerTools: ToolId[] = ["bmi", "body-fat", "tdee", "macro", "pregnancy", "ovulation"];

const missionPoints = [
  "Easy to access",
  "Easy to understand",
  "Transparent about formulas and limits",
  "Supported by useful educational information",
  "Available without sign-ups or complicated steps",
];

const accuracyPoints = [
  "We aim to use established formulas and reputable references.",
  "Content may be reviewed when guidelines or knowledge change.",
  "Report calculation errors, outdated references, or unclear text via Contact Us.",
  "Results are educational estimates — not diagnosis or treatment advice.",
];

export default function AboutView({ siteUrl, description }: { siteUrl: string; description: string }) {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about-us#webpage`,
    name: "About FitnessCalculatorPro.com",
    url: `${siteUrl}/about-us`,
    description,
    inLanguage: "en-US",
    isPartOf: websiteRef(siteUrl),
    mainEntity: organizationRef(siteUrl),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="about" />
      <div className="relative isolate flex flex-1 flex-col">
        <PageHero
          image="/images/overview-wellness.jpg"
          imageAlt="Woman meditating outdoors at sunrise"
          eyebrow="About Us"
          icon={Info}
          title="About FitnessCalculatorPro.com"
          description={
            <p>
              A free online resource designed to make fitness and health calculations easier to understand — with clear
              results, methodology, and limitations.
            </p>
          }
        >
          <Breadcrumbs siteUrl={siteUrl} items={[{ name: "About Us", href: "/about-us" }]} />
        </PageHero>

        <main className="page-main section-block relative z-10">
          <article className="content-readable w-full divide-y divide-slate-200">
            <section className="pb-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Our mission</h2>
              <p className="mt-3 max-w-none text-base leading-7 text-slate-700">
                Make common fitness and health calculations clear, transparent, and useful — so you understand the
                estimate, not just the number. We aim to create a reliable educational resource for fitness, nutrition,
                body composition, calories, pregnancy dates, fertility timing, and related topics.
              </p>
              <ul className="mt-4 grid list-disc gap-x-10 gap-y-2 pl-5 text-base leading-7 text-slate-700 marker:text-emerald-700 sm:grid-cols-2 lg:grid-cols-3">
                {missionPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">What we offer</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Free online health and fitness calculators. Enter the requested information, get an estimate, and read
                what the result means — including important limits.
              </p>
              <ul className="mt-4 grid list-disc gap-x-10 gap-y-2 pl-5 text-base leading-7 text-slate-700 marker:text-emerald-700 sm:grid-cols-2 lg:grid-cols-3">
                {offerTools.map((toolId) => {
                  const tool = getToolLink(toolId);
                  return (
                    <li key={toolId}>
                      <Link href={toolHref(tool)} className="content-link font-medium">
                        {tool.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">How calculators work</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                We use established formulas and commonly accepted methods. Calculator pages explain the methodology and
                provide context so you can interpret results carefully. Online calculators have limits — individual
                circumstances vary, and an estimate is not a measurement, diagnosis, or personalized recommendation.
              </p>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Your privacy</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Calculator values are intended to process in your browser. We do not intentionally collect them as personal
                health records. Information you send through Contact Us may be used so we can reply. Read our{" "}
                <Link href="/privacy-policy" className="content-link">
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Accuracy and transparency</h2>
              <ul className="mt-4 grid list-disc gap-x-10 gap-y-2 pl-5 text-base leading-7 text-slate-700 marker:text-emerald-700 sm:grid-cols-2">
                {accuracyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Educational purpose</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Content on FitnessCalculatorPro.com is for general informational and educational purposes only. We do not
                provide medical diagnosis, treatment, professional nutrition counseling, or individualized healthcare
                advice. Discuss health decisions with a qualified professional who knows your circumstances.
              </p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Also read our{" "}
                <Link href="/disclaimer" className="content-link">
                  Disclaimer
                </Link>
                ,{" "}
                <Link href="/privacy-policy" className="content-link">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/terms-and-conditions" className="content-link">
                  Terms and Conditions
                </Link>
                .
              </p>
            </section>

            <section className="pt-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Feedback and suggestions</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Found an error, have a technical issue, or want a new calculator? Visit{" "}
                <Link href="/contact-us" className="content-link">
                  Contact Us
                </Link>{" "}
                or browse{" "}
                <Link href="/calculators" className="content-link">
                  all calculators
                </Link>
                .
              </p>
            </section>
          </article>
        </main>
      </div>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
    </div>
  );
}
