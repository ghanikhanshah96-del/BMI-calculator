import {
  Activity,
  Apple,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CalendarHeart,
  CheckCircle2,
  Dumbbell,
  FileText,
  Leaf,
  Newspaper,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { blogPosts as allBlogPosts } from "./blog/posts";
import Reveal from "./components/reveal";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import { getSiteUrl } from "./lib/site-url";
import ToolsSection from "./tools-section";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Free BMI Calculator & Health Tools",
  description:
    "Free online BMI calculator plus TDEE/BMR, body fat, macro planner, pregnancy due date, and ovulation tools. Instant results with guides for every calculator.",
  keywords: [
    "BMI calculator",
    "free BMI calculator",
    "body mass index calculator",
    "TDEE calculator",
    "BMR calculator",
    "macro calculator",
    "body fat calculator",
    "due date calculator",
    "ovulation calculator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free BMI Calculator & Health Tools | FitnessCalculatorPro.com",
    description:
      "Calculate BMI, daily calories, body fat, macros, due date, and ovulation in one place—free and easy to use.",
    url: "/",
    siteName: "FitnessCalculatorPro.com",
    type: "website",
  },
};

const trustPoints = [
  "Metric and US inputs with instant results",
  "BMI range and healthy weight guidance",
  "Energy, macros, and cycle estimates in one place",
  "Plain-language explanations for everyday decisions",
];

// Fixed "scattered" layout (not random) so server and client render identically.
const heroStats = [
  {
    label: "BMI range",
    value: "18.5 – 24.9",
    hint: "Healthy adult range",
    icon: Scale,
    position: "lg:left-0 lg:top-4",
    rotate: "-6deg",
    float: "animate-float-a",
    delay: "0s",
    mobileOffset: "",
  },
  {
    label: "Sample TDEE",
    value: "2,238 kcal",
    hint: "Moderately active",
    icon: Dumbbell,
    position: "lg:right-0 lg:top-20",
    rotate: "5deg",
    float: "animate-float-b",
    delay: "-2s",
    mobileOffset: "mt-6 lg:mt-0",
  },
  {
    label: "Macro balance",
    value: "30 / 40 / 30",
    hint: "Protein · Carbs · Fat",
    icon: Apple,
    position: "lg:-left-6 lg:bottom-24",
    rotate: "3deg",
    float: "animate-float-c",
    delay: "-4s",
    mobileOffset: "",
  },
  {
    label: "Cycle window",
    value: "6 days",
    hint: "Fertile window",
    icon: CalendarHeart,
    position: "lg:bottom-2 lg:right-10",
    rotate: "-4deg",
    float: "animate-float-a",
    delay: "-1.5s",
    mobileOffset: "mt-6 lg:mt-0",
  },
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

const blogPosts = allBlogPosts.slice(0, 3);

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
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
          className={`mt-4 text-3xl leading-tight sm:text-[2.25rem] ${light ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p className={`max-w-md text-sm leading-6 ${light ? "text-emerald-50" : "text-slate-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteUrl}/#webapp`,
    name: "FitnessCalculatorPro.com",
    alternateName: "Fitness Calculator Pro",
    applicationCategory: "HealthApplication",
    applicationSubCategory: "Body Mass Index and Wellness Calculators",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    url: `${siteUrl}/`,
    image: `${siteUrl}/icon.svg`,
    description:
      "FitnessCalculatorPro.com helps people calculate Body Mass Index (BMI), total daily energy expenditure (TDEE), body fat percentage, nutrition macros, pregnancy due date, and ovulation fertile window using established formulas.",
    about: [
      "Body Mass Index",
      "Calorie and TDEE planning",
      "Body composition",
      "Pregnancy dating",
      "Fertility window estimates",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "BMI calculator with healthy weight range",
      "TDEE and BMR calculator (Mifflin St Jeor)",
      "Macro planner for protein, carbs, and fat",
      "Body fat calculator (U.S. Navy method)",
      "Pregnancy due date calculator",
      "Ovulation and fertile window calculator",
    ],
    isAccessibleForFree: true,
    inLanguage: "en-US",
    provider: {
      "@type": "Organization",
      name: "FitnessCalculatorPro.com",
      url: siteUrl,
    },
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader activePage="home" />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-y-0 right-0 -z-20 hidden w-[62%] lg:block">
            <Image
              src="/images/hero-bg.jpg"
              alt=""
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

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-emerald-800 shadow-sm ring-1 ring-emerald-100">
                <BadgeCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Simple health numbers, explained clearly
              </div>
              <h1 className={`${raleway.className} max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]`}>
                Professional fitness and{" "}
                <span className="gradient-text">health calculators</span>{" "}
                for everyday planning.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Check your BMI, estimate calories, plan macros, review body composition, and track important cycle dates inside one calm, mobile-friendly health dashboard.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#tools" data-magnetic className="btn-gradient min-h-12 rounded-full px-6 text-sm font-semibold">
                  Open calculators <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link href="/blog" className="btn-outline min-h-12 rounded-full px-6 text-sm font-semibold">
                  Read health guides <BookOpen className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <li key={point} className="group flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
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

              <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-0 lg:block">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`group relative ${stat.float} ${stat.position} ${stat.mobileOffset} lg:absolute lg:z-10`}
                    style={{ animationDelay: stat.delay }}
                  >
                    <span className="pointer-events-none absolute -inset-1 rounded-[1.25rem] bg-linear-to-br from-emerald-400 via-teal-400 to-lime-300 opacity-0 blur-lg transition duration-500 group-hover:-translate-y-1.5 group-hover:opacity-50" />
                    <div data-tilt className="relative">
                      <div
                        className="relative cursor-default rounded-2xl bg-white/95 p-4 shadow-xl shadow-emerald-900/10 ring-1 ring-white transition duration-500 ease-out hover:bg-white hover:shadow-2xl hover:shadow-emerald-600/25 lg:w-52 lg:transform-[rotate(var(--rot))] hover:transform-[translateY(-4px)] lg:hover:transform-[rotate(0deg)_translateY(-6px)]"
                        style={{ "--rot": stat.rotate } as CSSProperties}
                      >
                        <div className="flex items-center justify-between">
                          <span className="icon-badge h-10 w-10 rounded-xl">
                            <stat.icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-emerald-500 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
                        </div>
                        <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-xl font-semibold text-slate-900">{stat.value}</p>
                        <p className="mt-0.5 text-xs text-emerald-700">{stat.hint}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <div className="defer-render mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Reveal>
            <SectionHeading
              eyebrow="Why it helps"
              title="Health numbers with the context you need"
            />
          </Reveal>
          <section className="grid gap-6 md:grid-cols-3" aria-label="Overview">
            {overviewCards.map(({ title, text, icon: Icon, image, imageAlt }, index) => (
              <Reveal key={title} delay={index * 120}>
                <article className="spotlight group card-lift h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      quality={60}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-slate-900/5 to-transparent" />
                  </div>
                  <div className="relative px-6 pb-6">
                    <span className="icon-badge -mt-6 h-12 w-12 rounded-xl ring-4 ring-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </section>
        </div>

        {/* Tools */}
        <section id="tools" className="defer-render relative isolate scroll-mt-16 overflow-hidden py-14 sm:py-16 lg:py-24">
          <Image
            src="/images/tools-bg.jpg"
            alt=""
            fill
            quality={45}
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-emerald-950/95 via-emerald-900/90 to-teal-900/85" />
          <div className="absolute -left-40 -top-20 -z-10 h-136 w-136 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.22),transparent_65%)]" />
          <div className="absolute -bottom-40 -right-40 -z-10 h-136 w-136 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.18),transparent_65%)]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              light
              eyebrow="Calculator suite"
              title="Choose the health tool you need"
              description="Results are estimates for education and planning. They work best when combined with your health history, measurements, and professional care."
            />
            <ToolsSection />
          </div>
        </section>

        <div className="defer-render mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* BMI guide */}
          <section id="guide" className="scroll-mt-28 py-16 lg:py-20">
            <Reveal>
              <SectionHeading eyebrow="BMI guide" title="Understand your BMI result with more context" />
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {bmiGuide.map((item, index) => (
                <Reveal key={item.range} delay={index * 100}>
                  <article className="spotlight group card-lift relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-linear-to-br ${item.bar} opacity-10 transition-opacity duration-500 group-hover:opacity-25`}
                    />
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.chip}`}>
                      {item.range}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Blog teaser */}
          <section className="grid gap-6 pb-16 lg:grid-cols-[0.85fr_1.15fr] lg:pb-20">
            <Reveal className="h-full">
              <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 text-white">
                <Image
                  src="/images/blog-hero.jpg"
                  alt=""
                  fill
                  quality={45}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="-z-20 object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-br from-emerald-900/95 via-emerald-800/90 to-teal-700/80" />
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Newspaper className="h-6 w-6" aria-hidden="true" />
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
                  Visit blog <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {blogPosts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 120}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="spotlight group card-lift flex h-full flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        quality={60}
                        sizes="(max-width: 768px) 100vw, 22vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm">
                        {post.toolLabel}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold leading-snug text-slate-900">{post.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-emerald-700">
                        Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Trust */}
          <section className="grid gap-5 pb-20 md:grid-cols-2" aria-label="Privacy and terms">
            {trustCards.map(({ href, icon: Icon, title, text, cta }, index) => (
              <Reveal key={href} delay={index * 120}>
                <Link
                  href={href}
                  className="spotlight group card-lift flex h-full gap-5 rounded-2xl bg-white p-6 text-slate-900 shadow-sm ring-1 ring-slate-900/5"
                >
                  <span className="icon-badge h-12 w-12 flex-none rounded-xl">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="block">
                    <span className="block text-lg font-semibold text-slate-900">{title}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">{text}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
