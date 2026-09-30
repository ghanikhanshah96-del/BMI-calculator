"use client";

import { Activity } from "./icons";
import { useMemo, useRef, useState } from "react";
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
  StatGrid,
  StatTile,
} from "./calc-ui";
import { CustomSelect, FieldShell, NumberStepper } from "./form-controls";
import {
  checkRange,
  formatCm,
  formatFeetInches,
  formatKg,
  formatLb,
  heightQuantity,
  KG_PER_LB,
  useUnitConversion,
  weightQuantity,
} from "../lib/units";
import { validateFields, type FieldRule } from "../lib/validate";

type UnitMode = "metric" | "imperial";
type Gender = "male" | "female";
type ActivityId = "sedentary" | "light" | "moderate" | "heavy" | "athlete";
type MacroGoal = "cut" | "maintain" | "bulk";
type MacroCarb = "low" | "moderate" | "high";
type FormulaUsed = "mifflin" | "katch";
type ResultTab = "overview" | "activity" | "macros" | "body";

type TdeeInputs = {
  gender: Gender | "";
  age: number | null;
  weightKg: number | null;
  weightLb: number | null;
  heightCm: number | null;
  heightFeet: number | null;
  heightInches: number | null;
  activity: ActivityId | "";
  bodyFat: number | null;
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

const EMPTY_INPUTS: TdeeInputs = {
  gender: "",
  age: null,
  weightKg: null,
  weightLb: null,
  heightCm: null,
  heightFeet: null,
  heightInches: null,
  activity: "",
  bodyFat: null,
};

const WEIGHT_KG_RANGE = [30, 300] as const;
const HEIGHT_CM_RANGE = [120, 230] as const;

const QUANTITIES = [
  heightQuantity<TdeeInputs, UnitMode>("imperial", "heightCm", "heightFeet", "heightInches"),
  weightQuantity<TdeeInputs, UnitMode>("imperial", "weightKg", "weightLb"),
];

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
    return { bf, kg, lb: kg / KG_PER_LB };
  });
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

/** `exact` holds the unrounded metric height (cm) and weight (kg) behind the fields. */
function buildResult(
  inputs: TdeeInputs,
  unitMode: UnitMode,
  exact: Record<string, number | null>,
): { ok: true; result: TdeeResult } | { ok: false; error: string } {
  const imperial = unitMode === "imperial";
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

  const harris = harrisBenedictRevised(weightKg, heightCm, age, gender);
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
  const idealWeights = idealWeightKg(gender, heightCm).map((row) => ({
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
      activity: activityMeta.id,
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
      age,
      gender,
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
    <StatGrid columns={3}>
      <StatTile center tone="emerald" label="Carbs" value={`${macros.carbsG}g`} />
      <StatTile center tone="sky" label="Protein" value={`${macros.proteinG}g`} />
      <StatTile center tone="amber" label="Fat" value={`${macros.fatG}g`} />
    </StatGrid>
  );
}

export default function TdeeCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [inputs, setInputs] = useState<TdeeInputs>(EMPTY_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TdeeResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [macroGoal, setMacroGoal] = useState<MacroGoal>("maintain");
  const [macroCarb, setMacroCarb] = useState<MacroCarb>("moderate");
  const [resultTab, setResultTab] = useState<ResultTab>("overview");
  const resultRef = useRef<HTMLDivElement>(null);
  const units = useUnitConversion(QUANTITIES);

  const macroCalories = useMemo(() => {
    if (!result) return 0;
    if (macroGoal === "cut") return result.cutCalories;
    if (macroGoal === "bulk") return result.bulkCalories;
    return result.tdee;
  }, [result, macroGoal]);

  /** `silent` runs after a unit switch: an incomplete form just shows no result instead of an error. */
  const run = (values: TdeeInputs, mode: UnitMode, silent = false) => {
    const built = buildResult(values, mode, units.metric(values, mode));
    if (built.ok === false) {
      setError(silent ? "" : built.error);
      setResult(null);
      return;
    }
    setError("");
    setResult(built.result);
    setResultTab("overview");
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

  const update = (patch: Partial<TdeeInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
    if ([patch.gender, patch.activity].includes("")) setResult(null);
  };

  const clear = () => {
    units.reset();
    setInputs(EMPTY_INPUTS);
    setUnitMode("metric");
    setError("");
    setResult(null);
    setMacroGoal("maintain");
    setMacroCarb("moderate");
    setResultTab("overview");
  };

  const weightDisplay = (kg: number) =>
    result?.unitMode === "imperial"
      ? `${(kg / KG_PER_LB).toFixed(0)} lb`
      : `${kg.toFixed(0)} kg`;

  return (
    <CalcLayout>
      <CalcForm>
        <CalcHeader
          icon={Activity}
          eyebrow="TDEE"
          title="Daily energy needs"
          description="Estimate maintenance calories, BMR, and goal targets."
        />

        <SegmentedControl
          label="Unit system"
          options={[
            { value: "imperial", label: "Imperial" },
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

        <InputGroup step={2} title="Measurements" hint={unitMode === "metric" ? "kg · cm" : "lb · ft/in"}>
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

        <InputGroup step={3} title="Lifestyle">
          <FieldShell label="Activity">
            <CustomSelect
              value={inputs.activity}
              placeholder="Select activity level"
              onChange={(activity) => update({ activity: activity as ActivityId })}
              options={ACTIVITY_OPTIONS.map((a) => ({ value: a.id, label: a.label }))}
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

      <ResultCard
        resultRef={resultRef}
        toolbar={
          result ? (
            <SegmentedControl
              role="tablist"
              label="Result sections"
              size="sm"
              options={[
                { value: "overview", label: "Overview" },
                { value: "activity", label: "Activity" },
                { value: "macros", label: "Macros" },
                { value: "body", label: "Body" },
              ]}
              value={resultTab}
              onChange={setResultTab}
            />
          ) : null
        }
      >
        {!result ? (
          <EmptyResult
            label="Maintenance calories"
            unit="kcal/day"
            stats={["BMR", "Harris–Benedict"]}
            rows={["Cut", "Maintain", "Bulk"]}
          />
        ) : (
          <ResultBody animationKey={`${animationKey}-${resultTab}`}>
            {resultTab === "overview" ? (
              <>
                <ResultHero
                  label="Maintenance calories"
                  value={formatCalories(result.tdee)}
                  unit="kcal/day"
                  badge={result.formula === "katch" ? "Katch–McArdle" : "Mifflin–St Jeor"}
                >
                  {formatCalories(result.weekly)} kcal/week · {result.age} y/o{" "}
                  <span className="capitalize">{result.gender}</span> · {result.heightCm} cm · {result.weightKg} kg
                  {result.bodyFat !== null ? ` · ${result.bodyFat}% BF` : ""}
                </ResultHero>

                <StatGrid>
                  <StatTile
                    label="BMR"
                    value={formatCalories(result.bmr)}
                    hint={result.formula === "katch" ? "Katch–McArdle" : "Mifflin"}
                  />
                  <StatTile
                    label="Harris–Benedict"
                    value={formatCalories(result.harrisBenedict)}
                    hint="Reference only"
                  />
                </StatGrid>

                <SectionTitle title="Goal calories" />
                <StatGrid columns={3}>
                  <StatTile center tone="rose" label="Cut" value={formatCalories(result.cutCalories)} />
                  <StatTile center tone="emerald" label="Maintain" value={formatCalories(result.tdee)} />
                  <StatTile center tone="sky" label="Bulk" value={formatCalories(result.bulkCalories)} />
                </StatGrid>

                {result.formula !== "katch" ? (
                  <ResultNote tone="info">Add your body fat % to switch to the Katch–McArdle formula.</ResultNote>
                ) : null}
              </>
            ) : null}

            {resultTab === "activity" ? (
              <>
                <SectionTitle title="Calories by activity" hint="Your activity level is highlighted." />
                <ResultTable
                  caption="Calories by activity level"
                  align={["left", "right"]}
                  rows={[
                    { key: "bmr", cells: ["Basal Metabolic Rate", formatCalories(result.bmr)] },
                    ...result.activityRows.map((row) => ({
                      key: row.id,
                      selected: row.selected,
                      cells: [row.label, formatCalories(row.calories)],
                    })),
                  ]}
                />
              </>
            ) : null}

            {resultTab === "macros" ? (
              <>
                <SectionTitle title="Macronutrients" hint="Goal and carb style update grams instantly." />
                <SegmentedControl
                  label="Calorie goal"
                  size="sm"
                  options={[
                    { value: "cut", label: "Cutting" },
                    { value: "maintain", label: "Maintenance" },
                    { value: "bulk", label: "Bulking" },
                  ]}
                  value={macroGoal}
                  onChange={setMacroGoal}
                />
                <SegmentedControl
                  label="Carb style"
                  size="sm"
                  options={[
                    { value: "low", label: "Low carb" },
                    { value: "moderate", label: "Moderate" },
                    { value: "high", label: "High carb" },
                  ]}
                  value={macroCarb}
                  onChange={setMacroCarb}
                />
                <p className="text-xs font-semibold text-slate-700">
                  {formatCalories(macroCalories)} kcal · {MACRO_SPLITS[macroCarb].label}
                </p>
                <MacroGrid calories={macroCalories} carb={macroCarb} />
              </>
            ) : null}

            {resultTab === "body" ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <SectionTitle
                    title={`Ideal weight: ${weightDisplay(result.idealMinKg)} – ${weightDisplay(result.idealMaxKg)}`}
                    hint="Medical formula estimates — less accurate with high muscle mass."
                  />
                  <ResultTable
                    caption="Ideal weight by formula"
                    align={["left", "right"]}
                    rows={result.idealWeights.map((row) => ({
                      key: row.name,
                      cells: [`${row.name.replace(" Formula", "")} (${row.year})`, weightDisplay(row.kg)],
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <SectionTitle
                    title={`BMI: ${result.bmi}`}
                    hint={
                      <>
                        Classified as <strong className={result.bmiCategoryTone}>{result.bmiCategory}</strong>
                      </>
                    }
                  />
                  <ResultTable
                    caption="BMI categories"
                    align={["left", "right"]}
                    rows={BMI_TABLE.map((row) => ({
                      key: row.label,
                      selected: result.bmiCategory === row.label,
                      cells: [row.range, row.label],
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <SectionTitle
                    title="Maximum muscular potential"
                    hint="Martin Berkhan estimate (stage-lean ≈ height cm − 100). Not a guarantee."
                  />
                  <ResultTable
                    caption="Maximum muscular potential"
                    head={["BF%", "kg", "lb"]}
                    align={["left", "right", "right"]}
                    rows={result.mmp.map((row) => ({
                      key: String(row.bf),
                      cells: [`${row.bf}%`, row.kg, row.lb],
                    }))}
                  />
                </div>
              </div>
            ) : null}

            <ResultNote>
              Estimates only — not medical advice. Adjust from real weight trends over 2–4 weeks.
            </ResultNote>
          </ResultBody>
        )}
      </ResultCard>
    </CalcLayout>
  );
}
