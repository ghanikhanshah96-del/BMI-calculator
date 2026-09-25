"use client";

import {
  Activity,
  Apple,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarHeart,
  CheckCircle2,
  Dumbbell,
  FileText,
  HeartPulse,
  Leaf,
  Newspaper,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BmiCalculator from "./components/bmi-calculator";
import BodyFatCalculator from "./components/body-fat-calculator";
import DueDateCalculator from "./components/due-date-calculator";
import MacroCalculator from "./components/macro-calculator";
import OvulationCalculator from "./components/ovulation-calculator";
import TdeeCalculator from "./components/tdee-calculator";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";

type ToolId = "bmi" | "tdee" | "body-fat" | "macro" | "pregnancy" | "ovulation";

const TOOL_IDS: ToolId[] = [
  "bmi",
  "tdee",
  "body-fat",
  "macro",
  "pregnancy",
  "ovulation",
];

function isToolId(value: string): value is ToolId {
  return TOOL_IDS.includes(value as ToolId);
}

function parseToolFromHash(hash: string): ToolId | null {
  const value = hash.replace(/^#/, "");
  if (value === "tools") return "bmi";
  return isToolId(value) ? value : null;
}

const tools = [
  { id: "bmi", label: "BMI Calculator", icon: Scale },
  { id: "tdee", label: "TDEE Calculator", icon: Activity },
  { id: "body-fat", label: "Body Fat %", icon: HeartPulse },
  { id: "macro", label: "Macro Planner", icon: Apple },
  { id: "pregnancy", label: "Due Date", icon: CalendarHeart },
  { id: "ovulation", label: "Ovulation", icon: Sparkles },
] as const;

const trustPoints = [
  "Metric inputs with instant results",
  "BMI range and healthy weight guidance",
  "Energy, macros, and cycle estimates in one place",
  "Plain-language explanations for everyday decisions",
];

const overviewCards = [
  {
    title: "Clear BMI Context",
    text: "See your BMI category, healthy weight range, and what the result can and cannot tell you about overall health.",
    icon: Scale,
  },
  {
    title: "Daily Energy Planning",
    text: "Estimate BMR and TDEE so your nutrition targets match your activity level and body goals.",
    icon: Activity,
  },
  {
    title: "Practical Wellness Notes",
    text: "Use gentle guidance around movement, protein, recovery, and consistency without turning health into a guessing game.",
    icon: Leaf,
  },
];

const bmiGuide = [
  {
    range: "Below 18.5",
    label: "Underweight",
    note: "May signal low body mass. Pair the number with appetite, strength, energy, and a clinician's advice if symptoms are present.",
  },
  {
    range: "18.5 to 24.9",
    label: "Healthy range",
    note: "Often associated with lower weight-related risk, though waist size, fitness, sleep, and labs still matter.",
  },
  {
    range: "25 to 29.9",
    label: "Overweight",
    note: "Worth reviewing habits, waist measurement, blood pressure, and metabolic markers before making big changes.",
  },
  {
    range: "30 and above",
    label: "Obesity range",
    note: "Can be linked with higher health risk. Sustainable support and medical guidance can make changes safer and easier.",
  },
];

const blogPosts = [
  {
    title: "BMI Calculator Guide: What Body Mass Index Really Means",
    href: "/blog/bmi",
    summary:
      "Learn the BMI formula, adult categories, and how to use the number as a starting point, not a diagnosis.",
  },
  {
    title: "TDEE & BMR Explained with Mifflin & Katch–McArdle",
    href: "/blog/tdee",
    summary:
      "See how basal metabolism, activity multipliers, and optional body fat create a practical daily calorie estimate.",
  },
  {
    title: "Body Fat Percentage with the U.S. Navy Method",
    href: "/blog/body-fat",
    summary:
      "Understand circumference based body fat estimates and how to measure waist and neck consistently.",
  },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>("bmi");
  const activeToolDetails = tools.find((tool) => tool.id === activeTool) ?? tools[0];

  const activateTool = (toolId: ToolId, options?: { updateHash?: boolean; scroll?: boolean }) => {
    const updateHash = options?.updateHash ?? true;
    const scroll = options?.scroll ?? true;

    setActiveTool(toolId);

    if (updateHash && typeof window !== "undefined") {
      const nextHash = `#${toolId}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
    }

    if (scroll && typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document
          .getElementById("tools")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  useEffect(() => {
    const applyHash = (scroll: boolean) => {
      const toolId = parseToolFromHash(window.location.hash);
      if (!toolId) return;
      activateTool(toolId, { updateHash: false, scroll });
    };

    applyHash(Boolean(window.location.hash));

    const onHashChange = () => applyHash(true);
    const onActivateTool = (event: Event) => {
      const detail = (event as CustomEvent<{ tool?: string }>).detail;
      const toolId = detail?.tool ? parseToolFromHash(detail.tool) : null;
      if (!toolId) return;
      activateTool(toolId, { updateHash: true, scroll: true });
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("bmi-activate-tool", onActivateTool);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("bmi-activate-tool", onActivateTool);
    };
  }, []);

  return (
    <main className="min-h-screen bg-emerald-50 text-slate-950">
      <SiteHeader activePage="home" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-12">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
              <BadgeCheck className="h-4 w-4" />
              Simple health numbers, explained clearly
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Professional BMI and wellness calculators for everyday health planning.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Check your BMI, estimate calories, plan macros, review body composition, and track important cycle dates inside one calm, mobile-friendly health dashboard.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#tools"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-800/20 transition hover:bg-emerald-700"
              >
                Open calculators <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 font-bold text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Read health guides <BookOpen className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "BMI range", value: "18.5-24.9", icon: Scale },
                { label: "Sample TDEE", value: "2,238", icon: Dumbbell },
                { label: "Macro balance", value: "P C F", icon: Apple },
                { label: "Cycle window", value: "6 days", icon: CalendarHeart },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-emerald-50/80 p-4">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Health-friendly design
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                The green and white palette keeps the health tools calm, clean, and easy to scan.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-3">
          {overviewCards.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-700 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>

        <section id="tools" className="scroll-mt-28 py-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                Calculator suite
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Choose the health tool you need
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Results are estimates for education and planning. They work best when combined with your health history, measurements, and professional care.
            </p>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {tools.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-controls="calculator-panel"
                aria-pressed={activeTool === id}
                onClick={() => {
                  activateTool(id);
                }}
                className={[
                  "group flex min-h-16 items-center justify-between rounded-lg border px-4 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                  activeTool === id
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      activeTool === id ? "bg-white text-emerald-700" : "bg-emerald-50 text-emerald-700",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-bold">{label}</span>
                </span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          <section
            id="calculator-panel"
            className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm md:p-7"
          >
            <div className="mb-6 flex flex-col gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-slate-900 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Calculator
              </p>
              <p className="text-lg font-bold">{activeToolDetails.label}</p>
            </div>
            {activeTool === "bmi" && <BmiCalculator />}

            {activeTool === "tdee" && <TdeeCalculator />}

            {activeTool === "body-fat" && <BodyFatCalculator />}

            {activeTool === "macro" && <MacroCalculator />}

            {activeTool === "pregnancy" && <DueDateCalculator />}

            {activeTool === "ovulation" && <OvulationCalculator />}
          </section>
        </section>

        <section id="guide" className="scroll-mt-28 py-8">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              BMI guide
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Understand your BMI result with more context
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {bmiGuide.map((item) => (
              <article key={item.range} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-emerald-700">{item.range}</p>
                <h3 className="mt-2 text-xl font-black text-slate-950">{item.label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 py-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg bg-emerald-700 p-6 text-white">
            <Newspaper className="h-8 w-8" />
            <h2 className="mt-5 text-3xl font-black">Fresh health reading for better decisions</h2>
            <p className="mt-4 leading-7 text-emerald-50">
              The blog adds plain-language context around BMI, calories, progress tracking, and sustainable routines.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-emerald-800"
            >
              Visit blog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <h3 className="text-lg font-black text-slate-950">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{post.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-2">
          <Link href="/privacy" className="rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-sm hover:border-emerald-300">
            <ShieldCheck className="h-7 w-7 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">Privacy first health tools</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Calculator inputs are handled in the browser experience and the privacy page explains how data, cookies, and contact messages are treated.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">
              Read privacy policy
            </span>
          </Link>
          <Link href="/terms" className="rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-sm hover:border-emerald-300">
            <FileText className="h-7 w-7 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">Transparent terms</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The terms page explains educational use, health disclaimers, acceptable use, and the limits of calculator estimates.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">
              Read terms of use
            </span>
          </Link>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
