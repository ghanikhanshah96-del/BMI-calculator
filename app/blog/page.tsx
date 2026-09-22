import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Leaf,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "BMI Blog | Health, Calories & Weight Guides",
  description:
    "Read practical BMI, calorie planning, weight management, and wellness articles from BMI Wellness Pro.",
  keywords: [
    "BMI blog",
    "BMI guide",
    "weight loss tips",
    "calorie planning",
    "healthy weight",
    "wellness guide",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "BMI Blog | BMI Wellness Pro",
    description:
      "Practical guides for understanding BMI, calories, progress tracking, and healthy routines.",
    url: "/blog",
    siteName: "BMI Wellness Pro",
    type: "website",
  },
};

const articles = [
  {
    id: "bmi-starting-point",
    title: "BMI is a starting point, not your full health story",
    readTime: "5 min read",
    intro:
      "BMI is useful because it is quick, simple, and easy to compare across large groups. For an individual person, it is best treated as a screening number rather than a final answer.",
    points: [
      "BMI does not directly measure muscle, body fat percentage, waist size, hydration, or bone density.",
      "Athletes and highly active people may have a higher BMI because of lean mass.",
      "A useful next step is to compare BMI with waist measurement, blood pressure, blood sugar, sleep quality, and energy levels.",
    ],
  },
  {
    id: "calorie-target",
    title: "How to set a calorie target you can actually follow",
    readTime: "6 min read",
    intro:
      "A good calorie target should support your goal while still leaving room for normal meals, social life, training, and recovery.",
    points: [
      "Start with TDEE as your maintenance estimate, then adjust gradually.",
      "For fat loss, a moderate deficit is usually easier to sustain than an aggressive cut.",
      "For lean gain, a small surplus paired with progressive training helps limit unnecessary fat gain.",
    ],
  },
  {
    id: "progress-signals",
    title: "Healthy progress signals beyond the scale",
    readTime: "4 min read",
    intro:
      "Body weight can move up and down because of food volume, water, sodium, hormones, travel, and stress. Better tracking looks at several signals together.",
    points: [
      "Waist changes can reveal body composition progress even when weight stalls.",
      "Strength, walking pace, resting heart rate, and daily energy are useful performance markers.",
      "Sleep, digestion, mood, and hunger are important feedback about whether a routine is sustainable.",
    ],
  },
];

const habits = [
  "Keep protein present in most meals.",
  "Pair strength training with daily movement.",
  "Use waist, photos, and energy alongside weight.",
  "Review trends over weeks, not single days.",
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-emerald-50 text-slate-950">
      <SiteHeader activePage="blog" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
              <BookOpen className="h-4 w-4" />
              Health articles
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Practical BMI, nutrition, and wellness guides.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Build a healthier routine with plain-language articles about body weight, energy needs, progress tracking, and sustainable habits.
            </p>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5">
            <HeartPulse className="h-8 w-8 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Better health decisions start with context.
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              The calculator gives a number. These guides explain how to interpret that number with your habits, body composition, and long-term goals.
            </p>
            <Link
              href="/#tools"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
            >
              Open calculators <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="grid gap-5 py-8">
          {articles.map((article) => (
            <article
              key={article.id}
              id={article.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                {article.readTime}
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">{article.title}</h2>
              <p className="mt-4 leading-7 text-slate-600">{article.intro}</p>
              <div className="mt-5 grid gap-3">
                {article.points.map((point) => (
                  <div key={point} className="flex gap-3 rounded-lg bg-emerald-50 p-4 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-700" />
                    <p className="leading-6">{point}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 py-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-emerald-700 p-6 text-white">
            <Leaf className="h-8 w-8" />
            <h2 className="mt-5 text-3xl font-black">Small habits that support better results</h2>
            <p className="mt-4 leading-7 text-emerald-50">
              The best plan is the one you can repeat. Use health numbers to guide direction, then let your weekly habits do the quiet work.
            </p>
          </div>
          <div className="grid gap-3">
            {habits.map((habit) => (
              <div key={habit} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <p className="font-semibold text-slate-700">{habit}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
