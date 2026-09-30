"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  FileText,
  Leaf,
  Newspaper,
  Scale,
  ShieldCheck,
} from "./components/icons";
import { postCards } from "./blog/post-cards";
import FaqAccordion from "./components/faq-accordion";
import HeroToolCards from "./components/hero-tool-cards";
import JsonLd from "./components/json-ld";
import LegacyHashRedirect from "./components/legacy-hash-redirect";
import Reveal from "./components/reveal";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import ToolClusterGrid from "./components/tool-cards";
import { defaultOgImage, organizationRef, websiteRef } from "./lib/seo";
import { toolHref, toolLinks } from "./lib/tool-nav";

const posts = postCards.slice(0, 3);

const trustPoints = [
  "Metric and US inputs with instant results",
  "BMI range and healthy weight guidance",
  "Energy, macros, and cycle estimates in one place",
  "Plain-language explanations for everyday decisions",
];

const overviewCards = [
  {
    title: "Clear BMI context",
    text: "See your BMI category, healthy weight range, and what the result can and cannot tell you about overall health.",
    icon: Scale,
    image: "/images/overview-bmi.jpg",
    imageAlt: "Person checking a fitness smartwatch",
  },
  {
    title: "Daily energy planning",
    text: "Estimate BMR and TDEE so your nutrition targets match your activity level and body goals.",
    icon: Activity,
    image: "/images/overview-energy.jpg",
    imageAlt: "Runner in bright trainers climbing stone steps",
  },
  {
    title: "Practical wellness notes",
    text: "Gentle guidance around movement, protein, recovery, and consistency without turning health into a guessing game.",
    icon: Leaf,
    image: "/images/overview-wellness.jpg",
    imageAlt: "Woman meditating at sunrise",
  },
];

const steps = [
  {
    title: "Pick a calculator",
    text: "Choose the tool that matches your question, from a quick BMI check to a full calorie and macro plan or a due date estimate.",
  },
  {
    title: "Enter your details",
    text: "Type your measurements in metric or US units. Everything is calculated instantly in your browser, with no sign-up.",
  },
  {
    title: "Read the result in context",
    text: "Each result comes with its category, what it means, and a link to an in-depth guide on the method and its limits.",
  },
];

const bmiGuide = [
  {
    range: "Below 18.5",
    label: "Underweight",
    note: "May signal low body mass. Pair the number with appetite, strength, energy, and a clinician's advice if symptoms are present.",
    bar: "from-amber-300 to-amber-500",
    chip: "bg-amber-50 text-amber-800",
  },
  {
    range: "18.5 to 24.9",
    label: "Healthy range",
    note: "Often associated with lower weight-related risk, though waist size, fitness, sleep, and labs still matter.",
    bar: "from-emerald-400 to-teal-500",
    chip: "bg-emerald-50 text-emerald-800",
  },
  {
    range: "25 to 29.9",
    label: "Overweight",
    note: "Worth reviewing habits, waist measurement, blood pressure, and metabolic markers before making big changes.",
    bar: "from-orange-300 to-orange-500",
    chip: "bg-orange-50 text-orange-800",
  },
  {
    range: "30 and above",
    label: "Obesity range",
    note: "Can be linked with higher health risk. Sustainable support and medical guidance can make changes safer and easier.",
    bar: "from-rose-400 to-red-500",
    chip: "bg-rose-50 text-rose-800",
  },
];

const trustCards = [
  {
    href: "/privacy",
    icon: ShieldCheck,
    title: "Privacy-first health tools",
    text: "Calculator inputs are handled in the browser, and the privacy page explains how data, cookies, and contact messages are treated.",
    cta: "Read privacy policy",
  },
  {
    href: "/terms",
    icon: FileText,
    title: "Transparent terms",
    text: "The terms page explains educational use, health disclaimers, acceptable use, and the limits of calculator estimates.",
    cta: "Read terms of use",
  },
];

const faqs = [
  {
    question: "Are these fitness calculators free to use?",
    answer:
      "Yes. Every calculator and guide on FitnessCalculatorPro.com is free, with no account, subscription, or download required.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Each tool uses a published, widely used formula, so results match what a clinician or coach would calculate from the same inputs. They are still estimates: BMI does not measure body fat directly, tape-based body fat methods can be off by a few percentage points, and calorie equations are a starting point to fine tune with your real weight trend.",
  },
  {
    question: "Which calculator should I start with?",
    answer:
      "For a general check, start with the BMI calculator. If you want to change your weight, use the TDEE calculator to find maintenance calories and the macro calculator to turn a goal into daily grams. For pregnancy planning, use the ovulation calculator before conception and the due date calculator after a positive test.",
  },
  {
    question: "Do you save the information I enter?",
    answer:
      "No. Calculations run in your browser and your inputs are not sent to our servers. Close or refresh the page and the numbers are gone.",
  },
  {
    question: "Can I use metric and US units?",
    answer:
      "Yes. Every body measurement calculator accepts kilograms and centimeters or pounds, feet, and inches, and converts between them automatically.",
  },
  {
    question: "Can a calculator replace advice from my doctor?",
    answer:
      "No. The results are educational and cannot account for your full medical history. Use them to prepare better questions, and talk to a doctor, midwife, or registered dietitian before making medical decisions.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`section-head ${compact ? "mb-6 gap-3 sm:mb-7" : ""}`}>
      <div className="max-w-2xl">
        <p
          className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            light ? "bg-white/10 text-emerald-50 ring-1 ring-white/20" : "bg-emerald-100/70 text-emerald-800",
          ].join(" ")}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-lime-300" : "bg-emerald-500"}`} />
          {eyebrow}
        </p>
        <h2
          className={`leading-tight ${compact ? "mt-3 text-[1.75rem] sm:text-[2rem]" : "mt-4 text-3xl sm:text-[2.25rem]"} ${light ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p className={`max-w-md text-sm leading-6 ${light ? "text-emerald-50" : "text-slate-600"}`}>{description}</p>
      ) : null}
    </div>
  );
}

export default function HomeView({ siteUrl, headlineClass }: { siteUrl: string; headlineClass: string }) {
  const structuredData = [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        name: "Fitness and Health Calculators",
        url: `${siteUrl}/`,
        inLanguage: "en-US",
        isPartOf: websiteRef(siteUrl),
        publisher: organizationRef(siteUrl),
        primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}${defaultOgImage.url}` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: toolLinks.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.name,
            url: `${siteUrl}${toolHref(tool)}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
  ];

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="home" />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-y-0 right-0 -z-20 hidden w-[62%] lg:block">
            <Image
              src="/images/hero-bg.jpg"
              alt="Healthy breakfast plate with eggs, greens, tomatoes, and avocado on a wooden table"
              fill
              quality={45}
              sizes="62vw"
              className="object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#f6fbf8] via-[#f6fbf8]/90 to-[#f6fbf8]/40" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-[#f6fbf8] to-transparent" />
          <div className="absolute -left-40 -top-10 -z-10 h-128 w-lg rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.35),transparent_65%)]" />
          <div className="absolute right-0 top-1/3 -z-10 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.25),transparent_65%)]" />

          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:pb-16 lg:pt-14">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-emerald-800 shadow-sm ring-1 ring-emerald-100">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                Simple health numbers, explained clearly
              </div>
              <h1
                className={`${headlineClass} max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]`}
              >
                Professional fitness and <span className="gradient-text">health calculators</span> for everyday planning.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Check your BMI, estimate calories, plan macros, review body composition, and track important cycle dates
                inside one calm, mobile-friendly health dashboard.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/calculators" data-magnetic className="btn-gradient min-h-12 rounded-full px-6 text-sm font-semibold">
                  Browse all calculators <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/blog" className="btn-outline min-h-12 rounded-full px-6 text-sm font-semibold">
                  Read health guides <BookOpen className="h-4 w-4" />
                </Link>
              </div>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <li key={point} className="group flex items-start gap-3 text-sm text-slate-700">
                    <span className="check-dot">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative lg:h-[540px]">
              <div className="relative aspect-4/3 overflow-hidden rounded-4xl shadow-2xl shadow-emerald-900/20 ring-8 ring-white/70 lg:absolute lg:inset-x-14 lg:inset-y-12 lg:aspect-auto">
                <Image
                  src="/images/hero-person.jpg"
                  alt="Woman doing a core workout on a mat in a bright studio"
                  fill
                  fetchPriority="high"
                  loading="eager"
                  quality={60}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-[65%_center]"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-emerald-900/30 via-transparent to-transparent" />
              </div>

              <HeroToolCards />
            </div>
          </div>
        </section>

        {/* Overview */}
        <div className="section-block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Why it helps" title="Health numbers with the context you need" />
          </Reveal>
          <section className="grid gap-6 md:grid-cols-3" aria-label="Overview">
            {overviewCards.map(({ title, text, icon: Icon, image, imageAlt }, index) => (
              <Reveal key={title} delay={index * 120}>
                <article className="spotlight group card-lift card-surface h-full overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      quality={60}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="img-zoom"
                    />
                    <div className="photo-fade" />
                  </div>
                  <div className="relative px-6 pb-6">
                    <span className="icon-badge -mt-6 h-12 w-12 rounded-xl ring-4 ring-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                    <p className="muted-copy mt-2">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </section>

          <ol className="mt-10 grid gap-5 md:grid-cols-3" aria-label="How it works">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="icon-badge brand-badge text-sm font-semibold">{index + 1}</span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="muted-copy mt-1">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Tools */}
        <section
          id="tools"
          className="defer-render relative isolate flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center overflow-hidden py-8 lg:py-10"
        >
          <Image
            src="/images/tools-bg.jpg"
            alt="Balanced salad bowl with avocado, chickpeas, sweet potato, and tomatoes"
            fill
            quality={45}
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-emerald-950/95 via-emerald-900/90 to-teal-900/85" />
          <div className="absolute -left-40 -top-20 -z-10 h-136 w-136 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.22),transparent_65%)]" />
          <div className="absolute -bottom-40 -right-40 -z-10 h-136 w-136 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.18),transparent_65%)]" />

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              light
              compact
              eyebrow="Calculator suite"
              title="Choose the health tool you need"
              description="Each calculator has its own page with instructions, result explanations, and FAQs. Results are estimates for education and planning."
            />
            <ToolClusterGrid tone="dark" headingLevel="h3" compact />
            <div className="mt-6 flex justify-center lg:mt-7">
              <Link
                href="/calculators"
                data-magnetic
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-emerald-800 shadow-lg transition hover:shadow-xl"
              >
                View all calculators
                <ArrowRight className="arrow-nudge" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* BMI guide */}
          <section id="guide" className="section-block scroll-mt-28">
            <Reveal>
              <SectionHeading eyebrow="BMI guide" title="Understand your BMI result with more context" />
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {bmiGuide.map((item, index) => (
                <Reveal key={item.range} delay={index * 100}>
                  <article className="spotlight group card-lift card-surface relative h-full overflow-hidden p-6">
                    <span
                      aria-hidden="true"
                      className={`corner-glow ${item.bar}`}
                    />
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.chip}`}>{item.range}</span>
                    <h3 className="mt-4 text-lg font-semibold">{item.label}</h3>
                    <p className="muted-copy mt-2">{item.note}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="muted-copy mt-8">
              Find your own number with the{" "}
              <Link href="/bmi-calculator" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
                free BMI calculator
              </Link>
              , then check the{" "}
              <Link href="/body-fat-calculator" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
                body fat calculator
              </Link>{" "}
              if you carry a lot of muscle.
            </p>
          </section>

          {/* Blog teaser */}
          <section className="grid gap-6 pb-10 lg:grid-cols-[0.85fr_1.15fr] lg:pb-14">
            <Reveal className="h-full">
              <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 text-white">
                <Image
                  src="/images/blog-hero.jpg"
                  alt="Fresh vegetable salad with spinach, carrots, radish, and cucumber"
                  fill
                  quality={45}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="-z-20 object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-br from-emerald-900/95 via-emerald-800/90 to-teal-700/80" />
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Newspaper className="h-6 w-6" />
                  </span>
                  <h2 className="mt-6 text-3xl leading-tight">Fresh health reading for better decisions</h2>
                  <p className="mt-4 leading-7 text-emerald-50">
                    The blog adds plain-language context around BMI, calories, progress tracking, and sustainable routines.
                  </p>
                </div>
                <Link
                  href="/blog"
                  data-magnetic
                  className="group mt-8 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold text-emerald-800 shadow-lg transition hover:shadow-xl"
                >
                  Visit blog <ArrowRight className="arrow-nudge" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 120}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="spotlight group card-lift card-surface post-card"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        quality={60}
                        sizes="(max-width: 768px) 100vw, 22vw"
                        className="img-zoom"
                      />
                      <span className="photo-tag">
                        {post.toolLabel}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold leading-snug">{post.title}</h3>
                      <p className="muted-copy mt-2 line-clamp-3">{post.excerpt}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-emerald-700">
                        Read article <ArrowRight className="arrow-nudge" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="home-faq" className="mx-auto max-w-3xl pb-10 lg:pb-14">
            <h2 id="home-faq" className="text-center text-3xl leading-tight text-slate-900 sm:text-[2.25rem]">
              Frequently asked questions
            </h2>
            <FaqAccordion items={faqs} className="mt-6" />
          </section>

          {/* Trust */}
          <section className="grid gap-5 pb-12 md:grid-cols-2 lg:pb-16" aria-label="Privacy and terms">
            {trustCards.map(({ href, icon: Icon, title, text, cta }, index) => (
              <Reveal key={href} delay={index * 120}>
                <Link href={href} className="spotlight group card-lift card-surface flex h-full gap-5 p-6">
                  <span className="icon-badge h-12 w-12 flex-none rounded-xl">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="block">
                    <span className="block text-lg font-semibold">{title}</span>
                    <span className="muted-copy mt-2 block">{text}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      {cta} <ArrowRight className="arrow-nudge" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
      <LegacyHashRedirect />
      <JsonLd items={structuredData} />
    </div>
  );
}
