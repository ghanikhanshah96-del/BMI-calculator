"use client";

import { Activity, Eraser, Play } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CustomSelect, FieldShell, NumberStepper } from "./form-controls";

type UnitMode = "metric" | "imperial";
type Gender = "male" | "female";
type ActivityId = "sedentary" | "light" | "moderate" | "heavy" | "athlete";
type MacroGoal = "cut" | "maintain" | "bulk";
type MacroCarb = "low" | "moderate" | "high";
type FormulaUsed = "mifflin" | "katch";
type ResultTab = "overview" | "activity" | "macros" | "body";

type TdeeInputs = {
  gender: Gender;
  age: number;
  weightKg: number;
  weightLb: number;
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  activity: ActivityId;
  /** Empty string = optional field unused */
  bodyFat: string;
};

type IdealWeightRow = { name: string; year: string; kg: number };

type TdeeResult = {
  formula: FormulaUsed;
  bmr: number;
  harrisBenedict: number;
  tdee: number;
  weekly: number;
  activity: ActivityId;
  activityRows: Array<{ id: ActivityId; label: string; calories: number; selected: boolean }>;
  bmi: number;
  bmiCategory: string;
  bmiCategoryTone: string;
  idealWeights: IdealWeightRow[];
  idealMinKg: number;
  idealMaxKg: number;
  mmp: Array<{ bf: number; kg: number; lb: number }>;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  bodyFat: number | null;
  cutCalories: number;
  bulkCalories: number;
  unitMode: UnitMode;
};

const ACTIVITY_OPTIONS: Array<{ id: ActivityId; label: string; multiplier: number }> = [
  { id: "sedentary", label: "Sedentary (office job)", multiplier: 1.2 },
  { id: "light", label: "Light Exercise (1–2 days/week)", multiplier: 1.375 },
  { id: "moderate", label: "Moderate Exercise (3–5 days/week)", multiplier: 1.55 },
  { id: "heavy", label: "Heavy Exercise (6–7 days/week)", multiplier: 1.725 },
  { id: "athlete", label: "Athlete (2× per day)", multiplier: 1.9 },
];

const MACRO_SPLITS: Record<MacroCarb, { carbs: number; protein: number; fat: number; label: string }> = {
  low: { carbs: 0.2, protein: 0.4, fat: 0.4, label: "Low carb (20/40/40)" },
  moderate: { carbs: 0.35, protein: 0.4, fat: 0.25, label: "Moderate carb (35/40/25)" },
  high: { carbs: 0.5, protein: 0.3, fat: 0.2, label: "High carb (50/30/20)" },
};

const BMI_TABLE = [
  { max: 18.5, label: "Underweight", range: "18.5 or less" },
  { max: 25, label: "Normal Weight", range: "18.5 – 24.99" },
  { max: 30, label: "Overweight", range: "25 – 29.99" },
  { max: Infinity, label: "Obese", range: "30+" },
] as const;

const DEFAULT_INPUTS: TdeeInputs = {
  gender: "male",
  age: 25,
  weightKg: 70,
  weightLb: 154,
  heightCm: 175,
  heightFeet: 5,
  heightInches: 9,
  activity: "sedentary",
  bodyFat: "",
};

/** Imperial height options as total inches (4'7"–7'0"), same range as tdeecalculator.net */
const IMPERIAL_HEIGHT_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const totalInches = 55 + i;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return {
    value: String(totalInches),
    label: `${feet}ft ${inches}in`,
  };
});

function roundCal(n: number) {
  return Math.round(n);
}

function formatCalories(n: number) {
  return roundCal(n).toLocaleString("en-US");
}

function inchesOverFiveFeet(totalInches: number) {
  return totalInches - 60;
}

/** Ideal body weight formulas (kg) — Hamwi, Devine, Robinson, Miller */
function idealWeightKg(gender: Gender, heightCm: number): IdealWeightRow[] {
  const totalInches = heightCm / 2.54;
  const over = inchesOverFiveFeet(totalInches);
  const isMale = gender === "male";

  const hamwi = isMale ? 48 + 2.7 * over : 45.5 + 2.2 * over;
  const devine = isMale ? 50 + 2.3 * over : 45.5 + 2.3 * over;
  const robinson = isMale ? 52 + 1.9 * over : 49 + 1.7 * over;
  const miller = isMale ? 56.2 + 1.41 * over : 53.1 + 1.36 * over;

  return [
    { name: "G.J. Hamwi Formula", year: "1964", kg: Math.max(0, hamwi) },
    { name: "B.J. Devine Formula", year: "1974", kg: Math.max(0, devine) },
    { name: "J.D. Robinson Formula", year: "1983", kg: Math.max(0, robinson) },
    { name: "D.R. Miller Formula", year: "1983", kg: Math.max(0, miller) },
  ];
}

function getBmiCategory(bmi: number): { label: string; tone: string } {
  if (bmi < 18.5) return { label: "Underweight", tone: "text-amber-700" };
  if (bmi < 25) return { label: "Normal Weight", tone: "text-emerald-700" };
  if (bmi < 30) return { label: "Overweight", tone: "text-orange-700" };
  return { label: "Obese", tone: "text-red-700" };
}

function mifflinStJeor(weightKg: number, heightCm: number, age: number, gender: Gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  // Official Mifflin–St Jeor: +5 male, −161 female
  return gender === "male" ? base + 5 : base - 161;
}

function katchMcArdle(weightKg: number, bodyFatPct: number) {
  const lbm = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * lbm;
}

function harrisBenedictRevised(weightKg: number, heightCm: number, age: number, gender: Gender) {
  if (gender === "male") {
    return 13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362;
  }
  return 9.247 * weightKg + 3.098 * heightCm - 4.33 * age + 447.593;
}

/** Martin Berkhan MMP: stage-lean ≈ height(cm) − 100 at ~5% BF */
function muscularPotential(heightCm: number) {
  const stageLeanKg = heightCm - 100;
  const leanMass = stageLeanKg * 0.95;
  return [5, 10, 15].map((bf) => {
    const kg = leanMass / (1 - bf / 100);
    return { bf, kg, lb: kg / 0.45359237 };
  });
}

function parseOptionalBodyFat(raw: string): number | null {
  const cleaned = raw.trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0 || n >= 60) return null;
  return n;
}

function macrosFromCalories(calories: number, split: MacroCarb) {
  const s = MACRO_SPLITS[split];
  const carbsG = (calories * s.carbs) / 4;
  const proteinG = (calories * s.protein) / 4;
  const fatG = (calories * s.fat) / 9;
  return {
    carbsG: Math.round(carbsG),
    proteinG: Math.round(proteinG),
    fatG: Math.round(fatG),
  };
}

function buildResult(inputs: TdeeInputs, unitMode: UnitMode): { ok: true; result: TdeeResult } | { ok: false; error: string } {
  if (inputs.age < 15 || inputs.age > 120) {
    return { ok: false, error: "Age must be between 15 and 120." };
  }

  let weightKg: number;
  let heightCm: number;

  if (unitMode === "metric") {
    if (inputs.weightKg <= 0 || inputs.heightCm <= 0) {
      return { ok: false, error: "Enter a valid weight (kg) and height (cm)." };
    }
    weightKg = inputs.weightKg;
    heightCm = inputs.heightCm;
  } else {
    const totalInches = inputs.heightFeet * 12 + inputs.heightInches;
    if (inputs.weightLb <= 0 || totalInches <= 0) {
      return { ok: false, error: "Enter a valid weight (lb) and height (ft/in)." };
    }
    weightKg = inputs.weightLb * 0.45359237;
    heightCm = totalInches * 2.54;
  }

  const bodyFatRaw = inputs.bodyFat.trim();
  if (bodyFatRaw !== "") {
    const bf = Number(bodyFatRaw);
    if (!Number.isFinite(bf) || bf <= 0 || bf >= 60) {
      return { ok: false, error: "Body fat % must be between 1 and 59, or leave it blank." };
    }
  }

  const bodyFat = parseOptionalBodyFat(inputs.bodyFat);
  const formula: FormulaUsed = bodyFat !== null ? "katch" : "mifflin";
  const bmr =
    formula === "katch" && bodyFat !== null
      ? katchMcArdle(weightKg, bodyFat)
      : mifflinStJeor(weightKg, heightCm, inputs.age, inputs.gender);

  const harris = harrisBenedictRevised(weightKg, heightCm, inputs.age, inputs.gender);
  const activityMeta = ACTIVITY_OPTIONS.find((a) => a.id === inputs.activity)!;
  const tdee = bmr * activityMeta.multiplier;

  const activityRows = ACTIVITY_OPTIONS.map((a) => ({
    id: a.id,
    label: a.label,
    calories: roundCal(bmr * a.multiplier),
    selected: a.id === inputs.activity,
  }));

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const bmiCat = getBmiCategory(bmi);
  const idealWeights = idealWeightKg(inputs.gender, heightCm).map((row) => ({
    ...row,
    kg: Number(row.kg.toFixed(1)),
  }));
  const idealKgs = idealWeights.map((r) => r.kg);
  const mmp = muscularPotential(heightCm).map((row) => ({
    bf: row.bf,
    kg: Number(row.kg.toFixed(1)),
    lb: Number(row.lb.toFixed(1)),
  }));

  return {
    ok: true,
    result: {
      formula,
      bmr: roundCal(bmr),
      harrisBenedict: roundCal(harris),
      tdee: roundCal(tdee),
      weekly: roundCal(tdee * 7),
      activity: inputs.activity,
      activityRows,
      bmi: Number(bmi.toFixed(1)),
      bmiCategory: bmiCat.label,
      bmiCategoryTone: bmiCat.tone,
      idealWeights,
      idealMinKg: Math.min(...idealKgs),
      idealMaxKg: Math.max(...idealKgs),
      mmp,
      weightKg: Number(weightKg.toFixed(1)),
      heightCm: Number(heightCm.toFixed(1)),
      age: inputs.age,
      gender: inputs.gender,
      bodyFat,
      cutCalories: roundCal(tdee * 0.8),
      bulkCalories: roundCal(tdee * 1.15),
      unitMode,
    },
  };
}

function MacroGrid({ calories, carb }: { calories: number; carb: MacroCarb }) {
  const macros = macrosFromCalories(calories, carb);
  return (
    <div className="grid grid-cols-3 gap-2 text-center text-sm">
      <div className="rounded-lg bg-emerald-50 px-2 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Carbs</p>
        <p className="mt-1 text-lg font-black text-slate-950">{macros.carbsG}g</p>
      </div>
      <div className="rounded-lg bg-sky-50 px-2 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Protein</p>
        <p className="mt-1 text-lg font-black text-slate-950">{macros.proteinG}g</p>
      </div>
      <div className="rounded-lg bg-amber-50 px-2 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Fat</p>
        <p className="mt-1 text-lg font-black text-slate-950">{macros.fatG}g</p>
      </div>
    </div>
  );
}

export default function TdeeCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [inputs, setInputs] = useState<TdeeInputs>(DEFAULT_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TdeeResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [macroGoal, setMacroGoal] = useState<MacroGoal>("maintain");
  const [macroCarb, setMacroCarb] = useState<MacroCarb>("moderate");
  const [resultTab, setResultTab] = useState<ResultTab>("overview");
  const resultRef = useRef<HTMLDivElement>(null);

  const macroCalories = useMemo(() => {
    if (!result) return 0;
    if (macroGoal === "cut") return result.cutCalories;
    if (macroGoal === "bulk") return result.bulkCalories;
    return result.tdee;
  }, [result, macroGoal]);

  const calculate = () => {
    const built = buildResult(inputs, unitMode);
    if (built.ok === false) {
      setError(built.error);
      setResult(null);
      return;
    }
    setError("");
    setResult(built.result);
    setResultTab("overview");
    setAnimationKey((k) => k + 1);
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const clear = () => {
    setInputs(DEFAULT_INPUTS);
    setUnitMode("metric");
    setError("");
    setResult(null);
    setMacroGoal("maintain");
    setMacroCarb("moderate");
    setResultTab("overview");
  };

  const tabClass = (active: boolean) =>
    [
      "rounded-lg px-3 py-2 text-sm font-semibold transition",
      active
        ? "bg-emerald-700 text-white"
        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-emerald-50",
    ].join(" ");

  const chipClass = (active: boolean) =>
    [
      "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
      active
        ? "bg-emerald-700 text-white"
        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50",
    ].join(" ");

  const resultNavClass = (active: boolean) =>
    [
      "shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3",
      active
        ? "bg-white text-emerald-800 shadow-sm"
        : "text-emerald-50/90 hover:bg-white/10",
    ].join(" ");

  const weightDisplay = (kg: number) =>
    result?.unitMode === "imperial"
      ? `${(kg / 0.45359237).toFixed(0)} lb`
      : `${kg.toFixed(0)} kg`;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">TDEE</p>
            <h3 className="text-xl font-black text-slate-950 sm:text-2xl">Daily energy needs</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={tabClass(unitMode === "imperial")} onClick={() => setUnitMode("imperial")}>
            Imperial
          </button>
          <button type="button" className={tabClass(unitMode === "metric")} onClick={() => setUnitMode("metric")}>
            Metric
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldShell label="Gender">
              <CustomSelect
                value={inputs.gender}
                onChange={(gender) => setInputs({ ...inputs, gender: gender as Gender })}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
            </FieldShell>
            <FieldShell label="Age">
              <NumberStepper
                value={inputs.age}
                min={15}
                max={120}
                step={1}
                onChange={(age) => setInputs({ ...inputs, age })}
              />
            </FieldShell>
          </div>

          {unitMode === "metric" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldShell label="Weight">
                <NumberStepper
                  value={inputs.weightKg}
                  min={30}
                  max={300}
                  step={0.5}
                  suffix="kg"
                  onChange={(weightKg) => setInputs({ ...inputs, weightKg })}
                />
              </FieldShell>
              <FieldShell label="Height">
                <NumberStepper
                  value={inputs.heightCm}
                  min={120}
                  max={230}
                  step={1}
                  suffix="cm"
                  onChange={(heightCm) => setInputs({ ...inputs, heightCm })}
                />
              </FieldShell>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldShell label="Weight">
                <NumberStepper
                  value={inputs.weightLb}
                  min={66}
                  max={660}
                  step={1}
                  suffix="lb"
                  onChange={(weightLb) => setInputs({ ...inputs, weightLb })}
                />
              </FieldShell>
              <FieldShell label="Height">
                <CustomSelect
                  value={String(inputs.heightFeet * 12 + inputs.heightInches)}
                  onChange={(total) => {
                    const totalInches = Number(total);
                    setInputs({
                      ...inputs,
                      heightFeet: Math.floor(totalInches / 12),
                      heightInches: totalInches % 12,
                    });
                  }}
                  options={IMPERIAL_HEIGHT_OPTIONS}
                />
              </FieldShell>
            </div>
          )}

          <FieldShell label="Activity">
            <CustomSelect
              value={inputs.activity}
              onChange={(activity) => setInputs({ ...inputs, activity: activity as ActivityId })}
              options={ACTIVITY_OPTIONS.map((a) => ({ value: a.id, label: a.label }))}
            />
          </FieldShell>

          <FieldShell label="Body fat % (optional)">
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={inputs.bodyFat}
                placeholder="e.g. 15"
                maxLength={4}
                aria-label="Body fat percentage optional"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
                  setInputs({ ...inputs, bodyFat: raw });
                }}
                className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-lg font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                %
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Blank = Mifflin–St Jeor. With % = Katch–McArdle.
            </p>
          </FieldShell>
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current" />
            Calculate
          </button>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            <Eraser className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      <div
        ref={resultRef}
        className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        <div className="shrink-0 bg-emerald-700 px-3 py-3 sm:px-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Result</p>
            {result ? (
              <div
                className="flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="tablist"
                aria-label="Result sections"
              >
                {(
                  [
                    ["overview", "Overview"],
                    ["activity", "Activity"],
                    ["macros", "Macros"],
                    ["body", "Body"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={resultTab === id}
                    className={resultNavClass(resultTab === id)}
                    onClick={() => setResultTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:max-h-[min(68vh,640px)]">
          {!result ? (
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p className="text-lg font-semibold text-slate-900">No result yet</p>
              <p>
                Enter your details, then press <strong>Calculate</strong> for maintenance calories,
                BMR, macros, ideal weight, BMI, and muscular potential.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Default: Mifflin–St Jeor × activity</li>
                <li>With body fat: Katch–McArdle × activity</li>
                <li>Also shows Harris–Benedict for comparison</li>
              </ul>
            </div>
          ) : (
            <div
              key={`${animationKey}-${resultTab}`}
              className="space-y-4"
              style={{ animation: "bmiResultIn 0.28s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
            >
              {resultTab === "overview" ? (
                <>
                  <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    <strong>{result.age}</strong> y/o{" "}
                    <strong className="capitalize">{result.gender}</strong> ·{" "}
                    <strong>{result.heightCm} cm</strong> · <strong>{result.weightKg} kg</strong>
                    {result.bodyFat !== null ? (
                      <>
                        {" "}
                        · <strong>{result.bodyFat}%</strong> BF
                      </>
                    ) : null}
                  </p>

                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-5 ring-1 ring-emerald-100">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                      Maintenance calories
                    </p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                      {formatCalories(result.tdee)}
                      <span className="ml-1 text-base font-semibold text-slate-600">kcal/day</span>
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-600">
                      {formatCalories(result.weekly)} kcal/week
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {result.formula === "katch" ? "Katch–McArdle" : "Mifflin–St Jeor"}
                      {result.formula === "katch" ? " (body fat known)" : " · add BF% for Katch–McArdle"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        BMR
                      </p>
                      <p className="text-xl font-black text-slate-950">{formatCalories(result.bmr)}</p>
                      <p className="text-[11px] text-slate-500">
                        {result.formula === "katch" ? "Katch–McArdle" : "Mifflin"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Harris–Benedict
                      </p>
                      <p className="text-xl font-black text-slate-950">
                        {formatCalories(result.harrisBenedict)}
                      </p>
                      <p className="text-[11px] text-slate-500">Reference only</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Goal calories
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-rose-50 px-2 py-2.5 text-center">
                        <p className="text-[10px] font-semibold text-rose-700">Cut</p>
                        <p className="text-base font-black text-slate-950 sm:text-lg">
                          {formatCalories(result.cutCalories)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 px-2 py-2.5 text-center ring-1 ring-emerald-200">
                        <p className="text-[10px] font-semibold text-emerald-700">Maintain</p>
                        <p className="text-base font-black text-slate-950 sm:text-lg">
                          {formatCalories(result.tdee)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-sky-50 px-2 py-2.5 text-center">
                        <p className="text-[10px] font-semibold text-sky-700">Bulk</p>
                        <p className="text-base font-black text-slate-950 sm:text-lg">
                          {formatCalories(result.bulkCalories)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {resultTab === "activity" ? (
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Calories by activity</h4>
                  <p className="mt-1 text-xs text-slate-500">Your level is highlighted.</p>
                  <div className="mt-3 overflow-x-auto rounded-lg ring-1 ring-slate-200">
                    <table className="w-full min-w-[280px] text-left text-sm">
                      <tbody>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <td className="px-3 py-2 font-medium text-slate-700">Basal Metabolic Rate</td>
                          <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-900">
                            {formatCalories(result.bmr)}
                          </td>
                        </tr>
                        {result.activityRows.map((row) => (
                          <tr
                            key={row.id}
                            className={
                              row.selected
                                ? "border-b border-emerald-100 bg-emerald-50 font-bold text-emerald-950"
                                : "border-b border-slate-100 text-slate-700"
                            }
                          >
                            <td className="px-3 py-2">{row.label}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-right">
                              {formatCalories(row.calories)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {resultTab === "macros" ? (
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Macronutrients</h4>
                  <p className="mt-1 text-xs text-slate-500">Goal and carb style update grams instantly.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(
                      [
                        ["cut", "Cutting"],
                        ["maintain", "Maintenance"],
                        ["bulk", "Bulking"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        className={chipClass(macroGoal === id)}
                        onClick={() => setMacroGoal(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(
                      [
                        ["low", "Low carb"],
                        ["moderate", "Moderate"],
                        ["high", "High carb"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        className={chipClass(macroCarb === id)}
                        onClick={() => setMacroCarb(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-600">
                    {formatCalories(macroCalories)} kcal · {MACRO_SPLITS[macroCarb].label}
                  </p>
                  <div className="mt-2">
                    <MacroGrid calories={macroCalories} carb={macroCarb} />
                  </div>
                </div>
              ) : null}

              {resultTab === "body" ? (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Ideal weight: {weightDisplay(result.idealMinKg)} –{" "}
                      {weightDisplay(result.idealMaxKg)}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Medical formula estimates — less accurate with high muscle mass.
                    </p>
                    <div className="mt-2 overflow-x-auto rounded-lg ring-1 ring-slate-200">
                      <table className="w-full min-w-[260px] text-left text-sm">
                        <tbody>
                          {result.idealWeights.map((row) => (
                            <tr
                              key={row.name}
                              className="border-b border-slate-100 text-slate-700 last:border-0"
                            >
                              <td className="px-3 py-2">
                                {row.name.replace(" Formula", "")} ({row.year})
                              </td>
                              <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-900">
                                {weightDisplay(row.kg)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">BMI: {result.bmi}</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Classified as{" "}
                      <strong className={result.bmiCategoryTone}>{result.bmiCategory}</strong>
                    </p>
                    <div className="mt-2 overflow-x-auto rounded-lg ring-1 ring-slate-200">
                      <table className="w-full min-w-[240px] text-left text-sm">
                        <tbody>
                          {BMI_TABLE.map((row) => {
                            const selected = result.bmiCategory === row.label;
                            return (
                              <tr
                                key={row.label}
                                className={
                                  selected
                                    ? "border-b border-emerald-100 bg-emerald-50 font-bold text-emerald-950"
                                    : "border-b border-slate-100 text-slate-700 last:border-0"
                                }
                              >
                                <td className="px-3 py-2">{row.range}</td>
                                <td className="px-3 py-2 text-right">{row.label}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Maximum muscular potential</h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Martin Berkhan estimate (stage-lean ≈ height cm − 100). Not a guarantee.
                    </p>
                    <div className="mt-2 overflow-x-auto rounded-lg ring-1 ring-slate-200">
                      <table className="w-full min-w-[220px] text-left text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-3 py-2 font-semibold">BF%</th>
                            <th className="px-3 py-2 text-right font-semibold">kg</th>
                            <th className="px-3 py-2 text-right font-semibold">lb</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.mmp.map((row) => (
                            <tr key={row.bf} className="border-t border-slate-100 text-slate-700">
                              <td className="px-3 py-2">{row.bf}%</td>
                              <td className="px-3 py-2 text-right font-semibold">{row.kg}</td>
                              <td className="px-3 py-2 text-right font-semibold">{row.lb}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}

              <p className="border-t border-slate-100 pt-3 text-[11px] leading-4 text-slate-400">
                Estimates only — not medical advice. Adjust from real weight trends over 2–4 weeks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
