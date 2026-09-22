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
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";

type ToolId = "bmi" | "tdee" | "body-fat" | "macro" | "pregnancy" | "ovulation";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "athlete";

type GoalType = "fat-loss" | "maintenance" | "muscle-gain";

type TdeeForm = {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activity: ActivityLevel;
};

type BodyFatForm = {
  gender: "male" | "female";
  waist: number;
  neck: number;
  height: number;
  hip: number;
};

type MacroForm = {
  weight: number;
  calories: number;
  goal: GoalType;
};

const activityMultiplier: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

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
    title: "BMI is a starting point, not your full health story",
    href: "/blog#bmi-starting-point",
    summary:
      "Learn where BMI is useful, where it falls short, and what measurements add better context.",
  },
  {
    title: "How to set a calorie target you can actually follow",
    href: "/blog#calorie-target",
    summary:
      "A simple way to turn TDEE into a realistic plan for fat loss, maintenance, or lean gain.",
  },
  {
    title: "Healthy progress signals beyond the scale",
    href: "/blog#progress-signals",
    summary:
      "Energy, waist size, strength, sleep, and consistency often tell a richer story than weight alone.",
  },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-emerald-700" };
  if (bmi < 25) return { label: "Healthy range", color: "text-emerald-700" };
  if (bmi < 30) return { label: "Overweight", color: "text-emerald-700" };
  return { label: "Obesity range", color: "text-emerald-700" };
}

function getBodyFatCategory(gender: "male" | "female", bodyFat: number) {
  if (gender === "male") {
    if (bodyFat < 6) return "Essential";
    if (bodyFat < 14) return "Athletic";
    if (bodyFat < 18) return "Fit";
    if (bodyFat < 25) return "Average";
    return "High";
  }
  if (bodyFat < 13) return "Essential";
  if (bodyFat < 21) return "Athletic";
  if (bodyFat < 25) return "Fit";
  if (bodyFat < 32) return "Average";
  return "High";
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      <span className="mb-2 block font-medium">{label}</span>
      {children}
    </label>
  );
}

function inputClass() {
  return "w-full bg-transparent text-lg font-semibold text-slate-950 outline-none placeholder:text-slate-400";
}

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>("bmi");
  const [calculationTime] = useState(() => Date.now());
  const activeToolDetails = tools.find((tool) => tool.id === activeTool) ?? tools[0];

  const [bmiForm, setBmiForm] = useState({ weight: 72, height: 175 });
  const [tdeeForm, setTdeeForm] = useState<TdeeForm>({
    weight: 72,
    height: 175,
    age: 30,
    gender: "male",
    activity: "moderate",
  });
  const [bodyFatForm, setBodyFatForm] = useState<BodyFatForm>({
    gender: "male",
    waist: 84,
    neck: 38,
    height: 175,
    hip: 94,
  });
  const [macroForm, setMacroForm] = useState<MacroForm>({
    weight: 72,
    calories: 2200,
    goal: "fat-loss",
  });
  const [pregnancyForm, setPregnancyForm] = useState({
    conceptionDate: "2025-07-21",
    mode: "lmp" as "lmp" | "conception",
    lmp: "2025-01-10",
  });
  const [ovulationForm, setOvulationForm] = useState({
    cycleLength: 28,
    lastPeriod: "2025-08-18",
  });

  const bmiResult = useMemo(() => {
    const heightM = bmiForm.height / 100;
    const bmi = bmiForm.height > 0 ? bmiForm.weight / (heightM * heightM) : 0;
    return {
      bmi: Number(bmi.toFixed(1)),
      category: getBmiCategory(bmi),
      healthyWeightMin: (18.5 * heightM * heightM).toFixed(1),
      healthyWeightMax: (24.9 * heightM * heightM).toFixed(1),
    };
  }, [bmiForm]);

  const tdeeResult = useMemo(() => {
    const bmr =
      tdeeForm.gender === "male"
        ? 10 * tdeeForm.weight + 6.25 * tdeeForm.height - 5 * tdeeForm.age + 5
        : 10 * tdeeForm.weight + 6.25 * tdeeForm.height - 5 * tdeeForm.age - 161;

    const tdee = bmr * activityMultiplier[tdeeForm.activity];
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetRange: {
        lose: Math.round(tdee - 400),
        maintain: Math.round(tdee),
        gain: Math.round(tdee + 250),
      },
    };
  }, [tdeeForm]);

  const bodyFatResult = useMemo(() => {
    const waist = bodyFatForm.waist;
    const neck = bodyFatForm.neck;
    const height = bodyFatForm.height;
    const hip = bodyFatForm.hip;
    const canCalculate =
      height > 0 &&
      waist > neck &&
      (bodyFatForm.gender === "male" || waist + hip > neck);

    if (!canCalculate) {
      return {
        bodyFat: 0,
        category: "Enter valid measurements",
      };
    }

    const logWaistNeck = Math.log10(waist - neck);
    const logWaistHipNeck = Math.log10(waist + hip - neck);

    let fat = 0;
    if (bodyFatForm.gender === "male") {
      fat =
        495 /
          (1.0324 - 0.19077 * logWaistNeck + 0.15456 * Math.log10(height)) -
        450;
    } else {
      fat =
        495 /
          (1.29579 -
            0.35004 * logWaistHipNeck +
            0.221 * Math.log10(height)) -
        450;
    }

    return {
      bodyFat: Number(fat.toFixed(1)),
      category: getBodyFatCategory(bodyFatForm.gender, fat),
    };
  }, [bodyFatForm]);

  const macroResult = useMemo(() => {
    const proteinPerKg =
      macroForm.goal === "fat-loss"
        ? 1.8
        : macroForm.goal === "muscle-gain"
          ? 2.1
          : 1.6;
    const protein = macroForm.weight * proteinPerKg;
    const calories = macroForm.calories;
    const fatCalories = calories * 0.28;
    const fat = fatCalories / 9;
    const carbsCalories = calories - protein * 4 - fat * 9;
    const carbs = Math.max(0, carbsCalories / 4);

    return {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      calories,
    };
  }, [macroForm]);

  const pregnancyResult = useMemo(() => {
    const lmpDate = new Date(pregnancyForm.lmp);
    const conceptionDate = new Date(pregnancyForm.conceptionDate);
    const dueDate =
      pregnancyForm.mode === "lmp"
        ? new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000)
        : new Date(conceptionDate.getTime() + 266 * 24 * 60 * 60 * 1000);
    const startDate = pregnancyForm.mode === "lmp" ? lmpDate : conceptionDate;
    const weeksPregnant = Math.max(
      0,
      Math.floor(
        (calculationTime - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      ),
    );

    return {
      dueDate,
      isValid: !Number.isNaN(dueDate.getTime()),
      weeksPregnant,
      trimester:
        weeksPregnant < 14
          ? "Trimester 1"
          : weeksPregnant < 28
            ? "Trimester 2"
            : "Trimester 3",
    };
  }, [calculationTime, pregnancyForm]);

  const ovulationResult = useMemo(() => {
    const lastPeriod = new Date(ovulationForm.lastPeriod);
    const ovulationDate = new Date(
      lastPeriod.getTime() +
        (ovulationForm.cycleLength - 14) * 24 * 60 * 60 * 1000,
    );
    const fertileStart = new Date(
      ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000,
    );
    const fertileEnd = new Date(ovulationDate.getTime() + 24 * 60 * 60 * 1000);
    const nextPeriodDate = new Date(
      lastPeriod.getTime() + ovulationForm.cycleLength * 24 * 60 * 60 * 1000,
    );

    return {
      ovulationDate,
      fertileStart,
      fertileEnd,
      nextPeriodDate,
    };
  }, [ovulationForm]);

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

          <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-2xl shadow-emerald-900/10">
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
                  setActiveTool(id);
                  window.requestAnimationFrame(() => {
                    document
                      .getElementById("calculator-panel")
                      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  });
                }}
                className={[
                  "group flex min-h-20 items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300",
                  activeTool === id
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-100"
                    : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900",
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
                  <span>
                    <span className="block font-black">{label}</span>
                    {activeTool === id && (
                      <span className="mt-1 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-xs font-black uppercase tracking-[0.14em] text-white">
                        Active
                      </span>
                    )}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          <section
            id="calculator-panel"
            className="rounded-lg border-2 border-emerald-700 bg-white p-5 shadow-2xl shadow-emerald-900/10 md:p-7"
          >
            <div className="mb-6 flex flex-col gap-2 rounded-lg bg-slate-950 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                Active calculator
              </p>
              <p className="text-lg font-black">{activeToolDetails.label}</p>
            </div>
            {activeTool === "bmi" && (
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">BMI</p>
                      <h3 className="text-2xl font-black text-slate-950">Body Mass Index</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldShell label="Weight (kg)">
                      <input
                        type="number"
                        value={bmiForm.weight}
                        onChange={(e) => setBmiForm({ ...bmiForm, weight: Number(e.target.value) || 0 })}
                        className={inputClass()}
                      />
                    </FieldShell>
                    <FieldShell label="Height (cm)">
                      <input
                        type="number"
                        value={bmiForm.height}
                        onChange={(e) => setBmiForm({ ...bmiForm, height: Number(e.target.value) || 0 })}
                        className={inputClass()}
                      />
                    </FieldShell>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Result</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-5xl font-black">{bmiResult.bmi}</span>
                    <span className="pb-2 text-sm text-emerald-50">BMI</span>
                  </div>
                  <p className="mt-4 text-lg font-bold">{bmiResult.category.label}</p>
                  <div className="mt-6 space-y-2 text-sm leading-6 text-emerald-50">
                    <p>Healthy weight range: {bmiResult.healthyWeightMin} to {bmiResult.healthyWeightMax} kg</p>
                    <p>Use this as a quick baseline, then compare it with waist size, strength, energy, and labs.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTool === "tdee" && (
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">TDEE</p>
                      <h3 className="text-2xl font-black text-slate-950">Daily energy needs</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldShell label="Weight (kg)">
                      <input type="number" value={tdeeForm.weight} onChange={(e) => setTdeeForm({ ...tdeeForm, weight: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    <FieldShell label="Height (cm)">
                      <input type="number" value={tdeeForm.height} onChange={(e) => setTdeeForm({ ...tdeeForm, height: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    <FieldShell label="Age">
                      <input type="number" value={tdeeForm.age} onChange={(e) => setTdeeForm({ ...tdeeForm, age: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    <FieldShell label="Gender">
                      <select value={tdeeForm.gender} onChange={(e) => setTdeeForm({ ...tdeeForm, gender: e.target.value as "male" | "female" })} className={inputClass()}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </FieldShell>
                  </div>
                  <FieldShell label="Activity level">
                    <select value={tdeeForm.activity} onChange={(e) => setTdeeForm({ ...tdeeForm, activity: e.target.value as ActivityLevel })} className={inputClass()}>
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light activity</option>
                      <option value="moderate">Moderate activity</option>
                      <option value="active">Active</option>
                      <option value="athlete">Athlete</option>
                    </select>
                  </FieldShell>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Estimated output</p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm text-emerald-50">BMR</p>
                      <p className="text-3xl font-black">{tdeeResult.bmr} kcal</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-50">TDEE</p>
                      <p className="text-3xl font-black">{tdeeResult.tdee} kcal</p>
                    </div>
                    <div className="rounded-lg bg-white/12 p-3 text-sm leading-6 text-white">
                      <p className="font-bold">Suggested targets</p>
                      <p>Fat loss: {tdeeResult.targetRange.lose} kcal</p>
                      <p>Maintain: {tdeeResult.targetRange.maintain} kcal</p>
                      <p>Lean gain: {tdeeResult.targetRange.gain} kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTool === "body-fat" && (
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Body fat</p>
                      <h3 className="text-2xl font-black text-slate-950">Body composition</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldShell label="Gender">
                      <select value={bodyFatForm.gender} onChange={(e) => setBodyFatForm({ ...bodyFatForm, gender: e.target.value as "male" | "female" })} className={inputClass()}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </FieldShell>
                    <FieldShell label="Height (cm)">
                      <input type="number" value={bodyFatForm.height} onChange={(e) => setBodyFatForm({ ...bodyFatForm, height: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    <FieldShell label="Waist (cm)">
                      <input type="number" value={bodyFatForm.waist} onChange={(e) => setBodyFatForm({ ...bodyFatForm, waist: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    <FieldShell label="Neck (cm)">
                      <input type="number" value={bodyFatForm.neck} onChange={(e) => setBodyFatForm({ ...bodyFatForm, neck: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    {bodyFatForm.gender === "female" && (
                      <FieldShell label="Hip (cm)">
                        <input type="number" value={bodyFatForm.hip} onChange={(e) => setBodyFatForm({ ...bodyFatForm, hip: Number(e.target.value) || 0 })} className={inputClass()} />
                      </FieldShell>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Estimated body fat</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-5xl font-black">{bodyFatResult.bodyFat}%</span>
                  </div>
                  <p className="mt-4 text-lg font-bold">{bodyFatResult.category}</p>
                  <p className="mt-6 text-sm leading-6 text-emerald-50">
                    Body composition trends can help explain fitness progress when scale weight is slow to change.
                  </p>
                </div>
              </div>
            )}

            {activeTool === "macro" && (
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Apple className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Macro plan</p>
                      <h3 className="text-2xl font-black text-slate-950">Nutrition guidance</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldShell label="Body weight (kg)">
                      <input type="number" value={macroForm.weight} onChange={(e) => setMacroForm({ ...macroForm, weight: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    <FieldShell label="Calories">
                      <input type="number" value={macroForm.calories} onChange={(e) => setMacroForm({ ...macroForm, calories: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                  </div>

                  <FieldShell label="Goal">
                    <select value={macroForm.goal} onChange={(e) => setMacroForm({ ...macroForm, goal: e.target.value as GoalType })} className={inputClass()}>
                      <option value="fat-loss">Fat loss</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="muscle-gain">Muscle gain</option>
                    </select>
                  </FieldShell>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Macro split</p>
                  <div className="mt-6 grid gap-3">
                    {[
                      ["Protein", `${macroResult.protein} g`],
                      ["Carbs", `${macroResult.carbs} g`],
                      ["Fat", `${macroResult.fat} g`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-white/12 p-3">
                        <p className="text-sm text-emerald-50">{label}</p>
                        <p className="text-3xl font-black">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTool === "pregnancy" && (
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <CalendarHeart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Due date</p>
                      <h3 className="text-2xl font-black text-slate-950">Pregnancy timeline</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldShell label="Method">
                      <select value={pregnancyForm.mode} onChange={(e) => setPregnancyForm({ ...pregnancyForm, mode: e.target.value as "lmp" | "conception" })} className={inputClass()}>
                        <option value="lmp">Last menstrual period</option>
                        <option value="conception">Conception date</option>
                      </select>
                    </FieldShell>
                    {pregnancyForm.mode === "lmp" ? (
                      <FieldShell label="LMP date">
                        <input type="date" value={pregnancyForm.lmp} onChange={(e) => setPregnancyForm({ ...pregnancyForm, lmp: e.target.value })} className={inputClass()} />
                      </FieldShell>
                    ) : (
                      <FieldShell label="Conception date">
                        <input type="date" value={pregnancyForm.conceptionDate} onChange={(e) => setPregnancyForm({ ...pregnancyForm, conceptionDate: e.target.value })} className={inputClass()} />
                      </FieldShell>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Estimated due date</p>
                  <div className="mt-6 space-y-4">
                    <p className="text-3xl font-black">{formatDate(pregnancyResult.dueDate)}</p>
                    <p className="text-sm text-emerald-50">Current timeline: {pregnancyResult.weeksPregnant} weeks</p>
                    <p className="text-sm text-emerald-50">{pregnancyResult.trimester}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTool === "ovulation" && (
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Ovulation</p>
                      <h3 className="text-2xl font-black text-slate-950">Fertile window</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldShell label="Cycle length (days)">
                      <input type="number" value={ovulationForm.cycleLength} onChange={(e) => setOvulationForm({ ...ovulationForm, cycleLength: Number(e.target.value) || 0 })} className={inputClass()} />
                    </FieldShell>
                    <FieldShell label="Last period">
                      <input type="date" value={ovulationForm.lastPeriod} onChange={(e) => setOvulationForm({ ...ovulationForm, lastPeriod: e.target.value })} className={inputClass()} />
                    </FieldShell>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Estimated results</p>
                  <div className="mt-6 space-y-3 text-sm leading-6 text-white">
                    <p>Ovulation: <span className="font-bold">{formatDate(ovulationResult.ovulationDate)}</span></p>
                    <p>Fertile window: {formatDate(ovulationResult.fertileStart)} to {formatDate(ovulationResult.fertileEnd)}</p>
                    <p>Next predicted period: {formatDate(ovulationResult.nextPeriodDate)}</p>
                  </div>
                </div>
              </div>
            )}
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
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
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
          <Link href="/privacy" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300">
            <ShieldCheck className="h-7 w-7 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">Privacy-first health tools</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Calculator inputs are handled in the browser experience and the privacy page explains how data, cookies, and contact messages are treated.
            </p>
          </Link>
          <Link href="/terms" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300">
            <FileText className="h-7 w-7 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">Transparent terms</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The terms page explains educational use, health disclaimers, acceptable use, and the limits of calculator estimates.
            </p>
          </Link>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
