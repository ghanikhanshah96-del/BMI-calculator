"use client";

import { Apple, Eraser, Play } from "lucide-react";
import { useRef, useState } from "react";
import { CustomSelect, FieldShell, NumberStepper } from "./form-controls";

type UnitMode = "metric" | "us";
type Gender = "male" | "female";
type ActivityId = "sedentary" | "light" | "moderate" | "heavy" | "athlete";
type GoalId =
  | "maintain"
  | "mild-loss"
  | "weight-loss"
  | "extreme-loss"
  | "mild-gain"
  | "weight-gain";
type MacroPref = "balanced" | "low-carb" | "high-carb" | "high-protein";
type FormulaUsed = "mifflin" | "katch";

type MacroInputs = {
  gender: Gender;
  age: number;
  weightKg: number;
  weightLb: number;
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  activity: ActivityId;
  goal: GoalId;
  macroPref: MacroPref;
  bodyFat: string;
};

type MacroResult = {
  formula: FormulaUsed;
  bmr: number;
  tdee: number;
  calories: number;
  goalLabel: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  proteinKcal: number;
  carbsKcal: number;
  fatKcal: number;
  prefLabel: string;
};

const ACTIVITY_OPTIONS: Array<{ id: ActivityId; label: string; multiplier: number }> = [
  { id: "sedentary", label: "Sedentary (office job)", multiplier: 1.2 },
  { id: "light", label: "Light Exercise (1–2 days/week)", multiplier: 1.375 },
  { id: "moderate", label: "Moderate Exercise (3–5 days/week)", multiplier: 1.55 },
  { id: "heavy", label: "Heavy Exercise (6–7 days/week)", multiplier: 1.725 },
  { id: "athlete", label: "Athlete (2× per day)", multiplier: 1.9 },
];

const GOAL_OPTIONS: Array<{ id: GoalId; label: string; delta: number }> = [
  { id: "maintain", label: "Maintain weight", delta: 0 },
  { id: "mild-loss", label: "Mild weight loss (~0.25 kg/week)", delta: -250 },
  { id: "weight-loss", label: "Weight loss (~0.5 kg/week)", delta: -500 },
  { id: "extreme-loss", label: "Extreme weight loss (~1 kg/week)", delta: -1000 },
  { id: "mild-gain", label: "Mild weight gain (~0.25 kg/week)", delta: 250 },
  { id: "weight-gain", label: "Weight gain (~0.5 kg/week)", delta: 500 },
];

const MACRO_PRESETS: Record<
  MacroPref,
  { carbs: number; protein: number; fat: number; label: string }
> = {
  balanced: { carbs: 0.4, protein: 0.3, fat: 0.3, label: "Balanced (40/30/30)" },
  "low-carb": { carbs: 0.2, protein: 0.4, fat: 0.4, label: "Low carb (20/40/40)" },
  "high-carb": { carbs: 0.5, protein: 0.25, fat: 0.25, label: "High carb (50/25/25)" },
  "high-protein": { carbs: 0.3, protein: 0.4, fat: 0.3, label: "High protein (30/40/30)" },
};

const DEFAULT_INPUTS: MacroInputs = {
  gender: "male",
  age: 25,
  weightKg: 70,
  weightLb: 154,
  heightCm: 175,
  heightFeet: 5,
  heightInches: 9,
  activity: "moderate",
  goal: "maintain",
  macroPref: "balanced",
  bodyFat: "",
};

function roundCal(n: number) {
  return Math.round(n);
}

function formatCalories(n: number) {
  return roundCal(n).toLocaleString("en-US");
}

function mifflinStJeor(weightKg: number, heightCm: number, age: number, gender: Gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

function katchMcArdle(weightKg: number, bodyFatPct: number) {
  const lbm = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * lbm;
}

function parseOptionalBodyFat(raw: string): number | null {
  const cleaned = raw.trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0 || n >= 60) return null;
  return n;
}

function buildResult(
  inputs: MacroInputs,
  unitMode: UnitMode,
): { ok: true; result: MacroResult } | { ok: false; error: string } {
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

  const activity = ACTIVITY_OPTIONS.find((a) => a.id === inputs.activity)!;
  const goal = GOAL_OPTIONS.find((g) => g.id === inputs.goal)!;
  const tdee = bmr * activity.multiplier;
  const calories = Math.max(1200, roundCal(tdee + goal.delta));

  const pref = MACRO_PRESETS[inputs.macroPref];
  const proteinKcal = calories * pref.protein;
  const carbsKcal = calories * pref.carbs;
  const fatKcal = calories * pref.fat;

  return {
    ok: true,
    result: {
      formula,
      bmr: roundCal(bmr),
      tdee: roundCal(tdee),
      calories,
      goalLabel: goal.label,
      proteinG: Math.round(proteinKcal / 4),
      carbsG: Math.round(carbsKcal / 4),
      fatG: Math.round(fatKcal / 9),
      proteinPct: Math.round(pref.protein * 100),
      carbsPct: Math.round(pref.carbs * 100),
      fatPct: Math.round(pref.fat * 100),
      proteinKcal: roundCal(proteinKcal),
      carbsKcal: roundCal(carbsKcal),
      fatKcal: roundCal(fatKcal),
      prefLabel: pref.label,
    },
  };
}

function MacroBar({
  label,
  grams,
  kcal,
  pct,
  color,
}: {
  label: string;
  grams: number;
  kcal: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="font-black text-slate-950">
          {grams}g <span className="font-medium text-slate-500">· {kcal} kcal · {pct}%</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function MacroCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [inputs, setInputs] = useState<MacroInputs>(DEFAULT_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MacroResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const built = buildResult(inputs, unitMode);
    if (built.ok === false) {
      setError(built.error);
      setResult(null);
      return;
    }
    setError("");
    setResult(built.result);
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
  };

  const tabClass = (active: boolean) =>
    [
      "rounded-lg px-3 py-2 text-sm font-semibold transition",
      active
        ? "bg-emerald-700 text-white"
        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-emerald-50",
    ].join(" ");

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Apple className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Macros</p>
            <h3 className="text-xl font-black text-slate-950 sm:text-2xl">Nutrition guidance</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={tabClass(unitMode === "us")} onClick={() => setUnitMode("us")}>
            US Units
          </button>
          <button
            type="button"
            className={tabClass(unitMode === "metric")}
            onClick={() => setUnitMode("metric")}
          >
            Metric Units
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
                <div className="grid grid-cols-2 gap-2">
                  <NumberStepper
                    value={inputs.heightFeet}
                    min={4}
                    max={7}
                    step={1}
                    suffix="ft"
                    onChange={(heightFeet) => setInputs({ ...inputs, heightFeet })}
                  />
                  <NumberStepper
                    value={inputs.heightInches}
                    min={0}
                    max={11}
                    step={1}
                    suffix="in"
                    onChange={(heightInches) => setInputs({ ...inputs, heightInches })}
                  />
                </div>
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

          <FieldShell label="Goal">
            <CustomSelect
              value={inputs.goal}
              onChange={(goal) => setInputs({ ...inputs, goal: goal as GoalId })}
              options={GOAL_OPTIONS.map((g) => ({ value: g.id, label: g.label }))}
            />
          </FieldShell>

          <FieldShell label="Macro preference">
            <CustomSelect
              value={inputs.macroPref}
              onChange={(macroPref) => setInputs({ ...inputs, macroPref: macroPref as MacroPref })}
              options={[
                { value: "balanced", label: "Balanced (40/30/30)" },
                { value: "low-carb", label: "Low carb (20/40/40)" },
                { value: "high-carb", label: "High carb (50/25/25)" },
                { value: "high-protein", label: "High protein (30/40/30)" },
              ]}
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
        <div className="shrink-0 bg-emerald-700 px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Result</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:max-h-[min(68vh,640px)]">
          {!result ? (
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p className="text-lg font-semibold text-slate-900">No result yet</p>
              <p>
                Enter your stats, activity, goal, and macro style, then press <strong>Calculate</strong>{" "}
                for daily calories and protein / carbs / fat targets.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>BMR via Mifflin–St Jeor (or Katch–McArdle with body fat)</li>
                <li>TDEE = BMR × activity, then adjust for your goal</li>
                <li>Macros from your preferred carb/protein/fat split</li>
              </ul>
            </div>
          ) : (
            <div
              key={animationKey}
              className="space-y-5"
              style={{ animation: "bmiResultIn 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
            >
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-5 ring-1 ring-emerald-100">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Daily calories
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {formatCalories(result.calories)}
                  <span className="ml-1 text-base font-semibold text-slate-600">kcal/day</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {result.goalLabel} · {result.formula === "katch" ? "Katch–McArdle" : "Mifflin–St Jeor"}{" "}
                  · maintenance {formatCalories(result.tdee)} kcal
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  Macronutrients · {result.prefLabel}
                </p>
                <div className="space-y-3">
                  <MacroBar
                    label="Carbs"
                    grams={result.carbsG}
                    kcal={result.carbsKcal}
                    pct={result.carbsPct}
                    color="#059669"
                  />
                  <MacroBar
                    label="Protein"
                    grams={result.proteinG}
                    kcal={result.proteinKcal}
                    pct={result.proteinPct}
                    color="#0284c7"
                  />
                  <MacroBar
                    label="Fat"
                    grams={result.fatG}
                    kcal={result.fatKcal}
                    pct={result.fatPct}
                    color="#d97706"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {(
                      [
                        ["BMR", `${formatCalories(result.bmr)} kcal`],
                        ["Maintenance (TDEE)", `${formatCalories(result.tdee)} kcal`],
                        ["Target calories", `${formatCalories(result.calories)} kcal`],
                        ["Carbs", `${result.carbsG} g (${result.carbsPct}%)`],
                        ["Protein", `${result.proteinG} g (${result.proteinPct}%)`],
                        ["Fat", `${result.fatG} g (${result.fatPct}%)`],
                      ] as const
                    ).map(([label, value]) => (
                      <tr key={label} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-2.5 text-slate-600">{label}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold text-slate-950">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] leading-4 text-slate-400">
                Estimates only — not medical advice. Recalculate when weight or activity changes, and
                adjust from real-world progress over 2–4 weeks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
