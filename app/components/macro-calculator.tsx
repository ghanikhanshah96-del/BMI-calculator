"use client";

import { Apple } from "./icons";
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
import {
  checkRange,
  formatCm,
  formatFeetInches,
  formatKg,
  formatLb,
  heightQuantity,
  useUnitConversion,
  weightQuantity,
} from "../lib/units";
import { validateFields, type FieldRule } from "../lib/validate";

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
  gender: Gender | "";
  age: number | null;
  weightKg: number | null;
  weightLb: number | null;
  heightCm: number | null;
  heightFeet: number | null;
  heightInches: number | null;
  activity: ActivityId | "";
  goal: GoalId | "";
  macroPref: MacroPref | "";
  bodyFat: number | null;
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

const EMPTY_INPUTS: MacroInputs = {
  gender: "",
  age: null,
  weightKg: null,
  weightLb: null,
  heightCm: null,
  heightFeet: null,
  heightInches: null,
  activity: "",
  goal: "",
  macroPref: "",
  bodyFat: null,
};

const WEIGHT_KG_RANGE = [30, 300] as const;
const HEIGHT_CM_RANGE = [120, 230] as const;

const QUANTITIES = [
  heightQuantity<MacroInputs, UnitMode>("us", "heightCm", "heightFeet", "heightInches"),
  weightQuantity<MacroInputs, UnitMode>("us", "weightKg", "weightLb"),
];

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

/** `exact` holds the unrounded metric height (cm) and weight (kg) behind the fields. */
function buildResult(
  inputs: MacroInputs,
  unitMode: UnitMode,
  exact: Record<string, number | null>,
): { ok: true; result: MacroResult } | { ok: false; error: string } {
  const imperial = unitMode === "us";
  const measurementRules: FieldRule[] = imperial
    ? [
        { label: "weight", value: inputs.weightLb },
        { label: "height in feet", value: inputs.heightFeet },
        { label: "inches", value: inputs.heightInches ?? 0, min: 0, max: 11.9, unit: "in" },
      ]
    : [
        { label: "weight", value: inputs.weightKg },
        { label: "height", value: inputs.heightCm },
      ];
  const error =
    validateFields([
      { label: "age", value: inputs.age, min: 15, max: 120 },
      ...measurementRules,
      { label: "gender", value: inputs.gender, kind: "choice" },
      { label: "activity level", value: inputs.activity, kind: "choice" },
      { label: "goal", value: inputs.goal, kind: "choice" },
      { label: "macro preference", value: inputs.macroPref, kind: "choice" },
    ]) ||
    checkRange("weight", exact.weight!, WEIGHT_KG_RANGE, imperial ? formatLb : formatKg) ||
    checkRange("height", exact.height!, HEIGHT_CM_RANGE, imperial ? formatFeetInches : formatCm);
  if (error) return { ok: false, error };
  if (inputs.bodyFat !== null && (inputs.bodyFat < 1 || inputs.bodyFat > 59)) {
    return { ok: false, error: "Body fat % must be between 1 and 59, or leave it blank." };
  }

  const gender = inputs.gender as Gender;
  const age = inputs.age!;
  const weightKg = exact.weight!;
  const heightCm = exact.height!;

  const bodyFat = inputs.bodyFat;
  const formula: FormulaUsed = bodyFat !== null ? "katch" : "mifflin";
  const bmr =
    formula === "katch" && bodyFat !== null
      ? katchMcArdle(weightKg, bodyFat)
      : mifflinStJeor(weightKg, heightCm, age, gender);

  const activity = ACTIVITY_OPTIONS.find((a) => a.id === inputs.activity)!;
  const goal = GOAL_OPTIONS.find((g) => g.id === inputs.goal)!;
  const tdee = bmr * activity.multiplier;
  const calories = Math.max(1200, roundCal(tdee + goal.delta));

  const pref = MACRO_PRESETS[inputs.macroPref as MacroPref];
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
  const [inputs, setInputs] = useState<MacroInputs>(EMPTY_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MacroResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const units = useUnitConversion(QUANTITIES);
  const update = (patch: Partial<MacroInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
    if ([patch.gender, patch.activity, patch.goal, patch.macroPref].includes("")) setResult(null);
  };

  /** `silent` runs after a unit switch: an incomplete form just shows no result instead of an error. */
  const run = (values: MacroInputs, mode: UnitMode, silent = false) => {
    const built = buildResult(values, mode, units.metric(values, mode));
    if (built.ok === false) {
      setError(silent ? "" : built.error);
      setResult(null);
      return;
    }
    setError("");
    setResult(built.result);
    setAnimationKey((k) => k + 1);
    if (silent) return;
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const calculate = () => run(inputs, unitMode);

  const changeUnit = (mode: UnitMode) => {
    if (mode === unitMode) return;
    const next = units.convert(inputs, unitMode, mode);
    setInputs(next);
    setUnitMode(mode);
    run(next, mode, true);
  };

  const clear = () => {
    units.reset();
    setInputs(EMPTY_INPUTS);
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
            { value: "us", label: "Imperial" },
            { value: "metric", label: "Metric" },
          ]}
          value={unitMode}
          onChange={changeUnit}
        />

        <InputGroup step={1} title="Your details">
          <FieldShell label="Gender">
            <CustomSelect
              value={inputs.gender}
              placeholder="Select gender"
              onChange={(gender) => update({ gender: gender as Gender })}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
          </FieldShell>
          <FieldShell label="Age">
            <NumberStepper value={inputs.age} min={15} max={120} step={1} placeholder={30} onChange={(age) => update({ age })} />
          </FieldShell>
        </InputGroup>

        <InputGroup step={2} title="Measurements" hint={unitMode === "metric" ? "kg · cm" : "lb · ft · in"}>
          {unitMode === "metric" ? (
            <>
              <FieldShell label="Weight">
                <NumberStepper
                  value={inputs.weightKg}
                  min={30}
                  max={300}
                  step={0.5}
                  suffix="kg"
                  placeholder={70}
                  onChange={(weightKg) => update({ weightKg })}
                />
              </FieldShell>
              <FieldShell label="Height">
                <NumberStepper
                  value={inputs.heightCm}
                  min={120}
                  max={230}
                  step={1}
                  suffix="cm"
                  placeholder={175}
                  onChange={(heightCm) => update({ heightCm })}
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
                  placeholder={155}
                  onChange={(weightLb) => update({ weightLb })}
                />
              </FieldShell>
              <FieldShell label="Height">
                <div className="grid grid-cols-2 gap-2">
                  <NumberStepper
                    value={inputs.heightFeet}
                    min={3}
                    max={7}
                    step={1}
                    suffix="ft"
                    placeholder={5}
                    onChange={(heightFeet) => update({ heightFeet })}
                  />
                  <NumberStepper
                    value={inputs.heightInches}
                    min={0}
                    max={11.9}
                    step={1}
                    suffix="in"
                    placeholder={9}
                    onChange={(heightInches) => update({ heightInches })}
                  />
                </div>
              </FieldShell>
            </>
          )}
        </InputGroup>

        <InputGroup step={3} title="Goal & preferences">
          <FieldShell label="Activity">
            <CustomSelect
              value={inputs.activity}
              placeholder="Select activity level"
              onChange={(activity) => update({ activity: activity as ActivityId })}
              options={ACTIVITY_OPTIONS.map((a) => ({ value: a.id, label: a.label }))}
            />
          </FieldShell>

          <FieldShell label="Goal">
            <CustomSelect
              value={inputs.goal}
              placeholder="Select your goal"
              onChange={(goal) => update({ goal: goal as GoalId })}
              options={GOAL_OPTIONS.map((g) => ({ value: g.id, label: g.label }))}
            />
          </FieldShell>

          <FieldShell label="Macro preference">
            <CustomSelect
              value={inputs.macroPref}
              placeholder="Select a macro split"
              onChange={(macroPref) => update({ macroPref: macroPref as MacroPref })}
              options={(Object.keys(MACRO_PRESETS) as MacroPref[]).map((id) => ({ value: id, label: MACRO_PRESETS[id].label }))}
            />
          </FieldShell>

          <FieldShell label="Body fat % (optional)">
            <NumberStepper
              value={inputs.bodyFat}
              min={1}
              max={59}
              step={0.5}
              suffix="%"
              placeholder={15}
              onChange={(bodyFat) => update({ bodyFat })}
            />
            <p className="mt-1.5 text-xs leading-5 text-slate-600">Blank = Mifflin–St Jeor. With % = Katch–McArdle.</p>
          </FieldShell>
        </InputGroup>

        <FormError message={error} />

        <ActionBar onCalculate={calculate} onClear={clear} />
      </CalcForm>

      <ResultCard resultRef={resultRef}>
        {!result ? (
          <EmptyResult
            label="Daily calories"
            unit="kcal/day"
            stats={["Carbs", "Protein", "Fat"]}
            rows={["BMR", "TDEE", "Target"]}
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
