"use client";

import { Apple } from "lucide-react";
import { useRef, useState } from "react";
import {
  ActionBar,
  CalcForm,
  CalcHeader,
  CalcLayout,
  EmptyResult,
  FormError,
  InputGroup,
  ResultBody,
  ResultCard,
  ResultHero,
  ResultNote,
  ResultTable,
  SectionTitle,
  SegmentedControl,
} from "./calc-ui";
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
    <div className="group space-y-1.5 rounded-xl px-3 py-2.5 transition duration-300 hover:bg-slate-50">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="font-semibold text-slate-950">
          {grams}g <span className="font-medium text-slate-600">· {kcal} kcal · {pct}%</span>
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-linear-to-r shadow-sm transition-all duration-700 group-hover:brightness-110 ${color}`}
          style={{ width: `${pct}%` }}
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

  return (
    <CalcLayout>
      <CalcForm>
        <CalcHeader
          icon={Apple}
          eyebrow="Macros"
          title="Nutrition guidance"
          description="Daily calories plus protein, carb, and fat targets for your goal."
        />

        <SegmentedControl
          label="Unit system"
          options={[
            { value: "us", label: "US Units" },
            { value: "metric", label: "Metric" },
          ]}
          value={unitMode}
          onChange={setUnitMode}
        />

        <InputGroup step={1} title="Your details">
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
        </InputGroup>

        <InputGroup
          step={2}
          title="Measurements"
          hint={unitMode === "metric" ? "kg · cm" : "lb · ft · in"}
          columns={unitMode === "metric" ? 2 : 1}
        >
          {unitMode === "metric" ? (
            <>
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
            </>
          ) : (
            <>
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
                <div className="grid gap-2 sm:grid-cols-2">
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
            </>
          )}
        </InputGroup>

        <InputGroup step={3} title="Goal & preferences" columns={1}>
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
            <div className="field-input flex min-h-12 items-center gap-2 rounded-xl px-3.5">
              <input
                type="text"
                inputMode="decimal"
                value={inputs.bodyFat}
                placeholder="e.g. 15"
                maxLength={4}
                aria-label="Body fat percentage (optional)"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
                  setInputs({ ...inputs, bodyFat: raw });
                }}
                className="w-full min-w-0 bg-transparent text-base font-semibold text-slate-950 caret-emerald-700 outline-none placeholder:text-slate-400 sm:text-lg"
              />
              <span className="shrink-0 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                %
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              Blank = Mifflin–St Jeor. With % = Katch–McArdle.
            </p>
          </FieldShell>
        </InputGroup>

        <FormError message={error} />

        <ActionBar onCalculate={calculate} onClear={clear} />
      </CalcForm>

      <ResultCard resultRef={resultRef}>
        {!result ? (
          <EmptyResult
            icon={Apple}
            text={
              <>
                Enter your stats, activity, goal, and macro style, then press <strong>Calculate</strong> for
                daily calories and protein / carbs / fat targets.
              </>
            }
            formulas={["Mifflin–St Jeor BMR", "TDEE = BMR × activity", "Custom macro split"]}
          />
        ) : (
          <ResultBody animationKey={animationKey}>
            <ResultHero
              label="Daily calories"
              value={formatCalories(result.calories)}
              unit="kcal/day"
              badge={result.goalLabel}
            >
              {result.formula === "katch" ? "Katch–McArdle" : "Mifflin–St Jeor"} · maintenance{" "}
              {formatCalories(result.tdee)} kcal
            </ResultHero>

            <div className="space-y-1">
              <SectionTitle title={`Macronutrients · ${result.prefLabel}`} />
              <div className="-mx-3">
                <MacroBar
                  label="Carbs"
                  grams={result.carbsG}
                  kcal={result.carbsKcal}
                  pct={result.carbsPct}
                  color="from-emerald-500 to-lime-400"
                />
                <MacroBar
                  label="Protein"
                  grams={result.proteinG}
                  kcal={result.proteinKcal}
                  pct={result.proteinPct}
                  color="from-teal-500 to-sky-500"
                />
                <MacroBar
                  label="Fat"
                  grams={result.fatG}
                  kcal={result.fatKcal}
                  pct={result.fatPct}
                  color="from-amber-400 to-orange-400"
                />
              </div>
            </div>

            <ResultTable
              caption="Calorie and macro summary"
              align={["left", "right"]}
              rows={[
                { key: "bmr", cells: ["BMR", `${formatCalories(result.bmr)} kcal`] },
                { key: "tdee", cells: ["Maintenance (TDEE)", `${formatCalories(result.tdee)} kcal`] },
                { key: "target", selected: true, cells: ["Target calories", `${formatCalories(result.calories)} kcal`] },
                { key: "carbs", cells: ["Carbs", `${result.carbsG} g (${result.carbsPct}%)`] },
                { key: "protein", cells: ["Protein", `${result.proteinG} g (${result.proteinPct}%)`] },
                { key: "fat", cells: ["Fat", `${result.fatG} g (${result.fatPct}%)`] },
              ]}
            />

            <ResultNote>
              Estimates only — not medical advice. Recalculate when weight or activity changes, and adjust from
              real-world progress over 2–4 weeks.
            </ResultNote>
          </ResultBody>
        )}
      </ResultCard>
    </CalcLayout>
  );
}
