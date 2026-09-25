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
import { useEffect, useMemo, useState } from "react";
import {
  CustomSelect,
  DatePicker,
  FieldShell,
  NumberStepper,
} from "./components/form-controls";
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
    title: "BMI Calculator Guide: What Body Mass Index Really Means",
    href: "/blog/bmi",
    summary:
      "Learn the BMI formula, adult categories, and how to use the number as a starting point, not a diagnosis.",
  },
  {
    title: "TDEE & BMR Explained with Mifflin St Jeor",
    href: "/blog/tdee",
    summary:
      "See how basal metabolism and activity multipliers create a practical daily calorie estimate.",
  },
  {
    title: "Body Fat Percentage with the U.S. Navy Method",
    href: "/blog/body-fat",
    summary:
      "Understand circumference based body fat estimates and how to measure waist and neck consistently.",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only hash sync
  }, []);

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
    const waistCm = bodyFatForm.waist;
    const neckCm = bodyFatForm.neck;
    const heightCm = bodyFatForm.height;
    const hipCm = bodyFatForm.hip;
    const canCalculate =
      heightCm > 0 &&
      waistCm > neckCm &&
      (bodyFatForm.gender === "male" || waistCm + hipCm > neckCm);

    if (!canCalculate) {
      return {
        bodyFat: 0,
        category: "Enter valid measurements",
      };
    }

    // U.S. Navy / DoD circumference method — coefficients require inches
    const toInches = (cm: number) => cm / 2.54;
    const waist = toInches(waistCm);
    const neck = toInches(neckCm);
    const height = toInches(heightCm);
    const hip = toInches(hipCm);

    let fat = 0;
    if (bodyFatForm.gender === "male") {
      fat =
        86.01 * Math.log10(waist - neck) -
        70.041 * Math.log10(height) +
        36.76;
    } else {
      fat =
        163.205 * Math.log10(waist + hip - neck) -
        97.684 * Math.log10(height) -
        78.387;
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
    const msPerDay = 24 * 60 * 60 * 1000;
    const msPerWeek = 7 * msPerDay;
    const weeksPregnant = Math.max(
      0,
      Math.floor((calculationTime - startDate.getTime()) / msPerWeek),
    );
    const isPastDue =
      !Number.isNaN(dueDate.getTime()) && calculationTime > dueDate.getTime();
    const daysPastDue = isPastDue
      ? Math.floor((calculationTime - dueDate.getTime()) / msPerDay)
      : 0;
    const weeksPastDue = isPastDue ? Math.floor(daysPastDue / 7) : 0;

    let trimester = "Trimester 3";
    if (isPastDue) {
      trimester = "Past due date";
    } else if (weeksPregnant < 14) {
      trimester = "Trimester 1";
    } else if (weeksPregnant < 28) {
      trimester = "Trimester 2";
    }

    return {
      dueDate,
      isValid: !Number.isNaN(dueDate.getTime()),
      weeksPregnant,
      trimester,
      isPastDue,
      daysPastDue,
      weeksPastDue,
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
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-bold !text-white shadow-lg shadow-emerald-800/20 transition hover:bg-emerald-700"
              >
                Open calculators <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 font-bold !text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
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
                      <NumberStepper
                        value={bmiForm.weight}
                        min={20}
                        max={300}
                        step={0.5}
                        onChange={(weight) => setBmiForm({ ...bmiForm, weight })}
                      />
                    </FieldShell>
                    <FieldShell label="Height (cm)">
                      <NumberStepper
                        value={bmiForm.height}
                        min={90}
                        max={250}
                        step={1}
                        onChange={(height) => setBmiForm({ ...bmiForm, height })}
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
                      <NumberStepper
                        value={tdeeForm.weight}
                        min={20}
                        max={300}
                        step={0.5}
                        onChange={(weight) => setTdeeForm({ ...tdeeForm, weight })}
                      />
                    </FieldShell>
                    <FieldShell label="Height (cm)">
                      <NumberStepper
                        value={tdeeForm.height}
                        min={90}
                        max={250}
                        step={1}
                        onChange={(height) => setTdeeForm({ ...tdeeForm, height })}
                      />
                    </FieldShell>
                    <FieldShell label="Age">
                      <NumberStepper
                        value={tdeeForm.age}
                        min={10}
                        max={100}
                        step={1}
                        onChange={(age) => setTdeeForm({ ...tdeeForm, age })}
                      />
                    </FieldShell>
                    <FieldShell label="Gender">
                      <CustomSelect
                        value={tdeeForm.gender}
                        onChange={(gender) =>
                          setTdeeForm({ ...tdeeForm, gender: gender as "male" | "female" })
                        }
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                        ]}
                      />
                    </FieldShell>
                  </div>
                  <FieldShell label="Activity level">
                    <CustomSelect
                      value={tdeeForm.activity}
                      onChange={(activity) =>
                        setTdeeForm({ ...tdeeForm, activity: activity as ActivityLevel })
                      }
                      options={[
                        { value: "sedentary", label: "Sedentary" },
                        { value: "light", label: "Light activity" },
                        { value: "moderate", label: "Moderate activity" },
                        { value: "active", label: "Active" },
                        { value: "athlete", label: "Athlete" },
                      ]}
                    />
                  </FieldShell>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Estimated output</p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm text-emerald-50">BMR</p>
                      <p className="text-3xl font-black">{tdeeResult.bmr} kcal</p>
                      <p className="mt-1 text-xs text-emerald-100/90">Mifflin St Jeor (kg, cm)</p>
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
                      <CustomSelect
                        value={bodyFatForm.gender}
                        onChange={(gender) =>
                          setBodyFatForm({ ...bodyFatForm, gender: gender as "male" | "female" })
                        }
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                        ]}
                      />
                    </FieldShell>
                    <FieldShell label="Height (cm)">
                      <NumberStepper
                        value={bodyFatForm.height}
                        min={90}
                        max={250}
                        step={1}
                        onChange={(height) => setBodyFatForm({ ...bodyFatForm, height })}
                      />
                    </FieldShell>
                    <FieldShell label="Waist (cm)">
                      <NumberStepper
                        value={bodyFatForm.waist}
                        min={40}
                        max={200}
                        step={0.5}
                        onChange={(waist) => setBodyFatForm({ ...bodyFatForm, waist })}
                      />
                    </FieldShell>
                    <FieldShell label="Neck (cm)">
                      <NumberStepper
                        value={bodyFatForm.neck}
                        min={20}
                        max={80}
                        step={0.5}
                        onChange={(neck) => setBodyFatForm({ ...bodyFatForm, neck })}
                      />
                    </FieldShell>
                    {bodyFatForm.gender === "female" && (
                      <FieldShell label="Hip (cm)">
                        <NumberStepper
                          value={bodyFatForm.hip}
                          min={40}
                          max={200}
                          step={0.5}
                          onChange={(hip) => setBodyFatForm({ ...bodyFatForm, hip })}
                        />
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
                  <p className="mt-2 text-xs text-emerald-100/90">U.S. Navy / DoD circumference method</p>
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
                      <NumberStepper
                        value={macroForm.weight}
                        min={20}
                        max={300}
                        step={0.5}
                        onChange={(weight) => setMacroForm({ ...macroForm, weight })}
                      />
                    </FieldShell>
                    <FieldShell label="Calories">
                      <NumberStepper
                        value={macroForm.calories}
                        min={800}
                        max={6000}
                        step={50}
                        onChange={(calories) => setMacroForm({ ...macroForm, calories })}
                      />
                    </FieldShell>
                  </div>

                  <FieldShell label="Goal">
                    <CustomSelect
                      value={macroForm.goal}
                      onChange={(goal) => setMacroForm({ ...macroForm, goal: goal as GoalType })}
                      options={[
                        { value: "fat-loss", label: "Fat loss" },
                        { value: "maintenance", label: "Maintenance" },
                        { value: "muscle-gain", label: "Muscle gain" },
                      ]}
                    />
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
                      <CustomSelect
                        value={pregnancyForm.mode}
                        onChange={(mode) =>
                          setPregnancyForm({
                            ...pregnancyForm,
                            mode: mode as "lmp" | "conception",
                          })
                        }
                        options={[
                          { value: "lmp", label: "Last menstrual period" },
                          { value: "conception", label: "Conception date" },
                        ]}
                      />
                    </FieldShell>
                    {pregnancyForm.mode === "lmp" ? (
                      <FieldShell label="LMP date">
                        <DatePicker
                          value={pregnancyForm.lmp}
                          onChange={(lmp) => setPregnancyForm({ ...pregnancyForm, lmp })}
                        />
                      </FieldShell>
                    ) : (
                      <FieldShell label="Conception date">
                        <DatePicker
                          value={pregnancyForm.conceptionDate}
                          onChange={(conceptionDate) =>
                            setPregnancyForm({ ...pregnancyForm, conceptionDate })
                          }
                        />
                      </FieldShell>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-700 p-5 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Estimated due date</p>
                  <div className="mt-6 space-y-4">
                    <p className="text-3xl font-black">{formatDate(pregnancyResult.dueDate)}</p>
                    {pregnancyResult.isPastDue ? (
                      <>
                        <p className="text-sm text-emerald-50">
                          Past due by {pregnancyResult.daysPastDue} day
                          {pregnancyResult.daysPastDue === 1 ? "" : "s"}
                          {pregnancyResult.weeksPastDue > 0
                            ? ` (${pregnancyResult.weeksPastDue} week${pregnancyResult.weeksPastDue === 1 ? "" : "s"})`
                            : ""}
                        </p>
                        <p className="text-sm font-bold text-emerald-50">Past due date</p>
                        <p className="text-sm leading-6 text-emerald-50/90">
                          The estimated due date has passed. This timeline no longer shows a pregnancy trimester.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-emerald-50">Current timeline: {pregnancyResult.weeksPregnant} weeks</p>
                        <p className="text-sm text-emerald-50">{pregnancyResult.trimester}</p>
                      </>
                    )}
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
                      <NumberStepper
                        value={ovulationForm.cycleLength}
                        min={20}
                        max={45}
                        step={1}
                        onChange={(cycleLength) =>
                          setOvulationForm({ ...ovulationForm, cycleLength })
                        }
                      />
                    </FieldShell>
                    <FieldShell label="Last period">
                      <DatePicker
                        value={ovulationForm.lastPeriod}
                        onChange={(lastPeriod) =>
                          setOvulationForm({ ...ovulationForm, lastPeriod })
                        }
                      />
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
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold !text-emerald-800"
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
