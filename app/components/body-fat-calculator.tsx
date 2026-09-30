"use client";

import { HeartPulse } from "./icons";
import { useEffect, useRef, useState } from "react";
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
  SegmentedControl,
  StatGrid,
  StatTile,
} from "./calc-ui";
import { CustomSelect, FieldShell, NumberStepper } from "./form-controls";
import {
  checkRange,
  CM_PER_IN,
  formatCm,
  formatFeetInches,
  formatIn,
  formatKg,
  formatLb,
  heightQuantity,
  KG_PER_LB,
  lengthQuantity,
  useUnitConversion,
  weightQuantity,
} from "../lib/units";
import { validateFields, type FieldRule } from "../lib/validate";

type UnitMode = "us" | "metric";
type Gender = "male" | "female";

type BodyFatInputs = {
  gender: Gender | "";
  age: number | null;
  weightLb: number | null;
  heightFeet: number | null;
  heightInches: number | null;
  neckIn: number | null;
  waistIn: number | null;
  hipIn: number | null;
  weightKg: number | null;
  heightCm: number | null;
  neckCm: number | null;
  waistCm: number | null;
  hipCm: number | null;
};

type AceCategory = "Essential" | "Athletes" | "Fitness" | "Average" | "Obese";

type BodyFatResult = {
  navyPct: number;
  bmiPct: number;
  category: AceCategory;
  categoryTone: string;
  fatMassKg: number;
  leanMassKg: number;
  idealPct: number;
  fatToLoseKg: number;
  gender: Gender;
};

const EMPTY_INPUTS: BodyFatInputs = {
  gender: "",
  age: null,
  weightLb: null,
  heightFeet: null,
  heightInches: null,
  neckIn: null,
  waistIn: null,
  hipIn: null,
  weightKg: null,
  heightCm: null,
  neckCm: null,
  waistCm: null,
  hipCm: null,
};

const RANGES = {
  weight: [25, 320],
  height: [100, 250],
  neck: [20, 80],
  waist: [40, 200],
  hip: [40, 200],
} as const;

const QUANTITIES = [
  weightQuantity<BodyFatInputs, UnitMode>("us", "weightKg", "weightLb"),
  heightQuantity<BodyFatInputs, UnitMode>("us", "heightCm", "heightFeet", "heightInches"),
  lengthQuantity<BodyFatInputs, UnitMode>("neck", "us", "neckCm", "neckIn"),
  lengthQuantity<BodyFatInputs, UnitMode>("waist", "us", "waistCm", "waistIn"),
  lengthQuantity<BodyFatInputs, UnitMode>("hip", "us", "hipCm", "hipIn"),
];

/** Jackson & Pollock ideal body fat % by age */
const JACKSON_POLLOCK: Array<{ age: number; male: number; female: number }> = [
  { age: 20, male: 8.5, female: 17.7 },
  { age: 25, male: 10.5, female: 18.4 },
  { age: 30, male: 12.7, female: 19.3 },
  { age: 35, male: 13.7, female: 21.5 },
  { age: 40, male: 15.3, female: 22.2 },
  { age: 45, male: 16.4, female: 22.9 },
  { age: 50, male: 18.9, female: 25.2 },
  { age: 55, male: 20.9, female: 26.3 },
];

/** ACE category segments — equal visual width for clear reading (like calculator.net) */
const MALE_SEGMENTS = [
  { key: "Essential" as const, from: 2, to: 6, color: "#b45309", tip: "Needed for health" },
  { key: "Athletes" as const, from: 6, to: 14, color: "#65a30d", tip: "Very lean / athletic" },
  { key: "Fitness" as const, from: 14, to: 18, color: "#047857", tip: "Fit range" },
  { key: "Average" as const, from: 18, to: 25, color: "#ca8a04", tip: "Typical range" },
  { key: "Obese" as const, from: 25, to: 45, color: "#b91c1c", tip: "High body fat" },
];

const FEMALE_SEGMENTS = [
  { key: "Essential" as const, from: 10, to: 14, color: "#b45309", tip: "Needed for health" },
  { key: "Athletes" as const, from: 14, to: 21, color: "#65a30d", tip: "Very lean / athletic" },
  { key: "Fitness" as const, from: 21, to: 25, color: "#047857", tip: "Fit range" },
  { key: "Average" as const, from: 25, to: 32, color: "#ca8a04", tip: "Typical range" },
  { key: "Obese" as const, from: 32, to: 50, color: "#b91c1c", tip: "High body fat" },
];

function log10(n: number) {
  return Math.log(n) / Math.LN10;
}

function interpolateIdeal(age: number, gender: Gender) {
  const key = gender === "male" ? "male" : "female";
  if (age <= JACKSON_POLLOCK[0].age) return JACKSON_POLLOCK[0][key];
  const last = JACKSON_POLLOCK[JACKSON_POLLOCK.length - 1];
  if (age >= last.age) return last[key];

  for (let i = 0; i < JACKSON_POLLOCK.length - 1; i += 1) {
    const a = JACKSON_POLLOCK[i];
    const b = JACKSON_POLLOCK[i + 1];
    if (age >= a.age && age <= b.age) {
      const t = (age - a.age) / (b.age - a.age);
      return a[key] + t * (b[key] - a[key]);
    }
  }
  return last[key];
}

function getAceCategory(gender: Gender, bf: number): { label: AceCategory; tone: string } {
  if (gender === "male") {
    if (bf < 6) return { label: "Essential", tone: "text-amber-800" };
    if (bf < 14) return { label: "Athletes", tone: "text-lime-700" };
    if (bf < 18) return { label: "Fitness", tone: "text-emerald-700" };
    if (bf < 25) return { label: "Average", tone: "text-yellow-700" };
    return { label: "Obese", tone: "text-red-700" };
  }
  if (bf < 14) return { label: "Essential", tone: "text-amber-800" };
  if (bf < 21) return { label: "Athletes", tone: "text-lime-700" };
  if (bf < 25) return { label: "Fitness", tone: "text-emerald-700" };
  if (bf < 32) return { label: "Average", tone: "text-yellow-700" };
  return { label: "Obese", tone: "text-red-700" };
}

function bfToGaugePos(gender: Gender, bf: number) {
  const segments = gender === "male" ? MALE_SEGMENTS : FEMALE_SEGMENTS;
  const n = segments.length;
  const min = segments[0].from;
  const max = segments[n - 1].to;
  const clamped = Math.min(max, Math.max(min, bf));

  for (let i = 0; i < n; i += 1) {
    const seg = segments[i];
    const segEnd = i === n - 1 ? seg.to : segments[i + 1].from;
    if (clamped >= seg.from && clamped <= segEnd) {
      const t = segEnd > seg.from ? (clamped - seg.from) / (segEnd - seg.from) : 0;
      const start = (i / n) * 100;
      const width = 100 / n;
      return start + t * width;
    }
  }
  return 50;
}

/** U.S. Navy method — USC inches formulas (same as calculator.net) */
function navyBodyFatPercent(gender: Gender, heightIn: number, neckIn: number, waistIn: number, hipIn: number) {
  if (gender === "male") {
    if (waistIn <= neckIn || heightIn <= 0) return null;
    return 86.01 * log10(waistIn - neckIn) - 70.041 * log10(heightIn) + 36.76;
  }
  if (waistIn + hipIn <= neckIn || heightIn <= 0) return null;
  return 163.205 * log10(waistIn + hipIn - neckIn) - 97.684 * log10(heightIn) - 78.387;
}

function bmiBodyFatPercent(gender: Gender, age: number, bmi: number) {
  if (age < 18) {
    return gender === "male" ? 1.51 * bmi - 0.7 * age - 2.2 : 1.51 * bmi - 0.7 * age + 1.4;
  }
  return gender === "male" ? 1.2 * bmi + 0.23 * age - 16.2 : 1.2 * bmi + 0.23 * age - 5.4;
}

/**
 * Checks the fields of the active unit system, then returns the exact measurements in inches and
 * kilograms (the Navy formula's units), or a validation message worded in the user's units.
 */
function readMeasurements(inputs: BodyFatInputs, unitMode: UnitMode, gender: Gender | "", exact: Record<string, number | null>) {
  const needsHip = gender === "female";
  const imperial = unitMode === "us";
  const presence: FieldRule[] = imperial
    ? [
        { label: "weight", value: inputs.weightLb },
        { label: "height in feet", value: inputs.heightFeet },
        { label: "inches", value: inputs.heightInches ?? 0, min: 0, max: 11.9, unit: "in" },
        { label: "neck", value: inputs.neckIn },
        { label: "waist", value: inputs.waistIn },
        ...(needsHip ? [{ label: "hip", value: inputs.hipIn }] : []),
      ]
    : [
        { label: "weight", value: inputs.weightKg },
        { label: "height", value: inputs.heightCm },
        { label: "neck", value: inputs.neckCm },
        { label: "waist", value: inputs.waistCm },
        ...(needsHip ? [{ label: "hip", value: inputs.hipCm }] : []),
      ];
  const length = imperial ? formatIn : formatCm;
  const error =
    validateFields(presence) ||
    checkRange("weight", exact.weight!, RANGES.weight, imperial ? formatLb : formatKg) ||
    checkRange("height", exact.height!, RANGES.height, imperial ? formatFeetInches : formatCm) ||
    checkRange("neck", exact.neck!, RANGES.neck, length) ||
    checkRange("waist", exact.waist!, RANGES.waist, length) ||
    (needsHip ? checkRange("hip", exact.hip!, RANGES.hip, length) : "");
  if (error) return error;
  return {
    heightIn: exact.height! / CM_PER_IN,
    neckIn: exact.neck! / CM_PER_IN,
    waistIn: exact.waist! / CM_PER_IN,
    hipIn: needsHip ? exact.hip! / CM_PER_IN : 0,
    weightKg: exact.weight!,
  };
}

function BodyFatGauge({
  percent,
  gender,
  category,
  animationKey,
}: {
  percent: number;
  gender: Gender;
  category: AceCategory;
  animationKey: number;
}) {
  const target = bfToGaugePos(gender, percent);
  const markerRef = useRef<HTMLDivElement>(null);
  const segments = gender === "male" ? MALE_SEGMENTS : FEMALE_SEGMENTS;
  const active = segments.find((s) => s.key === category) ?? segments[0];

  useEffect(() => {
    const el = markerRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.left = "0%";
    let frame = 0;
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        el.style.transition = "left 0.85s cubic-bezier(0.22, 0.61, 0.36, 1)";
        el.style.left = `${target}%`;
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [animationKey, target]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-linear-to-b from-slate-50 to-white px-3 py-3 ring-1 ring-slate-200/70">
        <div className="relative pt-8 pb-1">
          <div
            ref={markerRef}
            className="absolute top-0 z-20 flex -translate-x-1/2 flex-col items-center"
            style={{ left: "0%" }}
          >
            <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              {percent.toFixed(1)}%
            </span>
            <span
              className="mt-0.5 h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-slate-900"
              aria-hidden
            />
          </div>

          <div
            className="flex h-5 gap-1 overflow-visible"
            role="img"
            aria-label={`Body fat ${percent.toFixed(1)} percent — ${category}`}
          >
            {segments.map((seg) => (
              <div
                key={seg.key}
                className={[
                  "relative min-w-0 flex-1 rounded-sm shadow-inner",
                  seg.key === category ? "ring-2 ring-slate-900 ring-offset-1" : "opacity-90",
                ].join(" ")}
                style={{ backgroundColor: seg.color }}
                data-tip={`${seg.key}: ${seg.from}–${seg.to === segments[segments.length - 1].to ? `${seg.from}+` : seg.to}%`}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-5 gap-1">
          {segments.map((seg) => (
            <div
              key={seg.key}
              className={[
                "min-w-0 text-center leading-tight",
                seg.key === category ? "font-bold text-slate-900" : "font-medium text-slate-500",
              ].join(" ")}
            >
              <p className="truncate text-[10px] sm:text-[11px]">{seg.from}%</p>
              <p className="truncate text-[9px] sm:text-[10px]">{seg.key}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm" style={{ backgroundColor: `${active.color}18` }}>
        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: active.color }} aria-hidden />
        <p className="min-w-0 leading-5 text-slate-700">
          <strong className="text-slate-900">{category}</strong>
          <span className="text-slate-500"> — {active.tip}</span>
          <span className="mt-0.5 block text-xs text-slate-500">
            {gender === "male" ? "Men" : "Women"}: {active.from}
            {category === "Obese" ? "%+" : `–${active.to}%`}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function BodyFatCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("us");
  const [inputs, setInputs] = useState<BodyFatInputs>(EMPTY_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BodyFatResult | null>(null);
  const [displayUnits, setDisplayUnits] = useState<UnitMode>("us");
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const units = useUnitConversion(QUANTITIES);

  const update = (patch: Partial<BodyFatInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
    if (patch.gender === "") setResult(null);
  };
  const isFemale = inputs.gender === "female";

  /** `silent` runs after a unit switch: an incomplete form just shows no result instead of an error. */
  const run = (values: BodyFatInputs, mode: UnitMode, silent = false) => {
    const fail = (message: string) => {
      setError(silent ? "" : message);
      setResult(null);
    };
    const detailsError = validateFields([
      { label: "age", value: values.age, min: 10, max: 120 },
      { label: "gender", value: values.gender, kind: "choice" },
    ]);
    const measured = readMeasurements(values, mode, values.gender, units.metric(values, mode));
    const message = detailsError || (typeof measured === "string" ? measured : "");
    if (message || typeof measured === "string") {
      fail(message);
      return;
    }

    const gender = values.gender as Gender;
    const age = values.age!;
    const navy = navyBodyFatPercent(gender, measured.heightIn, measured.neckIn, measured.waistIn, measured.hipIn);
    if (navy === null || !Number.isFinite(navy)) {
      fail(
        gender === "male"
          ? "Waist must be larger than neck for a valid Navy estimate."
          : "Waist + hip must be larger than neck for a valid Navy estimate.",
      );
      return;
    }

    const heightM = measured.heightIn * 0.0254;
    const bmi = measured.weightKg / (heightM * heightM);
    const ace = getAceCategory(gender, navy);
    const fatMassKg = measured.weightKg * (navy / 100);
    const idealPct = interpolateIdeal(age, gender);

    setError("");
    setResult({
      navyPct: Number(navy.toFixed(1)),
      bmiPct: Number(bmiBodyFatPercent(gender, age, bmi).toFixed(1)),
      category: ace.label,
      categoryTone: ace.tone,
      fatMassKg,
      leanMassKg: measured.weightKg - fatMassKg,
      idealPct: Number(idealPct.toFixed(1)),
      fatToLoseKg: navy > idealPct ? measured.weightKg * ((navy - idealPct) / 100) : 0,
      gender,
    });
    setDisplayUnits(mode);
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
    setUnitMode("us");
    setError("");
    setResult(null);
  };

  const mass = (kg: number) =>
    displayUnits === "us" ? `${(kg / KG_PER_LB).toFixed(1)} lb` : `${kg.toFixed(1)} kg`;

  return (
    <CalcLayout>
      <CalcForm>
        <CalcHeader
          icon={HeartPulse}
          eyebrow="Body fat"
          title="Body composition"
          description="U.S. Navy tape-measure method with ACE categories."
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
            <NumberStepper value={inputs.age} min={10} max={120} step={1} placeholder={30} onChange={(age) => update({ age })} />
          </FieldShell>
        </InputGroup>

        {unitMode === "us" ? (
          <InputGroup step={2} title="Measurements" hint="lb · ft · in">
            <FieldShell label="Weight">
              <NumberStepper
                value={inputs.weightLb}
                min={50}
                max={700}
                step={0.5}
                suffix="lb"
                placeholder={160}
                onChange={(weightLb) => update({ weightLb })}
              />
            </FieldShell>
            <FieldShell label="Height">
              <div className="grid grid-cols-2 gap-2">
                <NumberStepper
                  value={inputs.heightFeet}
                  min={3}
                  max={8}
                  step={1}
                  suffix="ft"
                  placeholder={5}
                  onChange={(heightFeet) => update({ heightFeet })}
                />
                <NumberStepper
                  value={inputs.heightInches}
                  min={0}
                  max={11.9}
                  step={0.5}
                  suffix="in"
                  placeholder={10}
                  onChange={(heightInches) => update({ heightInches })}
                />
              </div>
            </FieldShell>
            <FieldShell label="Neck">
              <NumberStepper
                value={inputs.neckIn}
                min={8}
                max={30}
                step={0.5}
                suffix="in"
                placeholder={15}
                onChange={(neckIn) => update({ neckIn })}
              />
            </FieldShell>
            <FieldShell label="Waist">
              <NumberStepper
                value={inputs.waistIn}
                min={20}
                max={80}
                step={0.5}
                suffix="in"
                placeholder={34}
                onChange={(waistIn) => update({ waistIn })}
              />
            </FieldShell>
            {isFemale ? (
              <FieldShell label="Hip">
                <NumberStepper
                  value={inputs.hipIn}
                  min={20}
                  max={80}
                  step={0.5}
                  suffix="in"
                  placeholder={38}
                  onChange={(hipIn) => update({ hipIn })}
                />
              </FieldShell>
            ) : null}
          </InputGroup>
        ) : (
          <InputGroup step={2} title="Measurements" hint="kg · cm">
            <FieldShell label="Weight">
              <NumberStepper
                value={inputs.weightKg}
                min={25}
                max={320}
                step={0.5}
                suffix="kg"
                placeholder={72}
                onChange={(weightKg) => update({ weightKg })}
              />
            </FieldShell>
            <FieldShell label="Height">
              <NumberStepper
                value={inputs.heightCm}
                min={100}
                max={250}
                step={0.5}
                suffix="cm"
                placeholder={178}
                onChange={(heightCm) => update({ heightCm })}
              />
            </FieldShell>
            <FieldShell label="Neck">
              <NumberStepper
                value={inputs.neckCm}
                min={20}
                max={80}
                step={0.5}
                suffix="cm"
                placeholder={38}
                onChange={(neckCm) => update({ neckCm })}
              />
            </FieldShell>
            <FieldShell label="Waist">
              <NumberStepper
                value={inputs.waistCm}
                min={40}
                max={200}
                step={0.5}
                suffix="cm"
                placeholder={86}
                onChange={(waistCm) => update({ waistCm })}
              />
            </FieldShell>
            {isFemale ? (
              <FieldShell label="Hip">
                <NumberStepper
                  value={inputs.hipCm}
                  min={40}
                  max={200}
                  step={0.5}
                  suffix="cm"
                  placeholder={97}
                  onChange={(hipCm) => update({ hipCm })}
                />
              </FieldShell>
            ) : null}
          </InputGroup>
        )}

        <FormError message={error} />

        <ActionBar onCalculate={calculate} onClear={clear} />
      </CalcForm>

      <ResultCard
        resultRef={resultRef}
        toolbar={
          result ? (
            <SegmentedControl
              label="Show results in"
              size="sm"
              options={[
                { value: "us", label: "Imperial" },
                { value: "metric", label: "Metric" },
              ]}
              value={displayUnits}
              onChange={setDisplayUnits}
            />
          ) : null
        }
      >
        {!result ? (
          <EmptyResult
            label="Body fat (U.S. Navy)"
            unit="%"
            stats={["Fat mass", "Lean mass"]}
            rows={["Body fat category", "Ideal body fat", "Fat to lose", "BMI method"]}
          />
        ) : (
          <ResultBody animationKey={animationKey}>
            <ResultHero label="Body fat (U.S. Navy)" value={`${result.navyPct}%`} badge={result.category}>
              Ideal for your age: {result.idealPct}%
            </ResultHero>

            <BodyFatGauge
              percent={result.navyPct}
              gender={result.gender}
              category={result.category}
              animationKey={animationKey}
            />

            <StatGrid>
              <StatTile tone="amber" label="Fat mass" value={mass(result.fatMassKg)} />
              <StatTile tone="emerald" label="Lean mass" value={mass(result.leanMassKg)} />
            </StatGrid>

            <ResultTable
              caption="Body fat details"
              align={["left", "right"]}
              rows={[
                { key: "navy", cells: ["Body Fat (U.S. Navy Method)", `${result.navyPct}%`] },
                {
                  key: "category",
                  cells: ["Body Fat Category", <span key="c" className={result.categoryTone}>{result.category}</span>],
                },
                { key: "ideal", cells: ["Ideal Body Fat for Age (Jackson & Pollock)", `${result.idealPct}%`] },
                {
                  key: "lose",
                  cells: [
                    "Body Fat to Lose to Reach Ideal",
                    result.fatToLoseKg > 0 ? mass(result.fatToLoseKg) : "At or below ideal",
                  ],
                },
                { key: "bmi", cells: ["Body Fat (BMI method)", `${result.bmiPct}%`] },
              ]}
            />

            <ResultNote tone="info">
              <strong>ACE body fat categories — </strong>
              {result.gender === "male"
                ? "Men: Essential 2–5% · Athletes 6–13% · Fitness 14–17% · Average 18–24% · Obese 25%+"
                : "Women: Essential 10–13% · Athletes 14–20% · Fitness 21–24% · Average 25–31% · Obese 32%+"}
            </ResultNote>

            <ResultNote>
              Estimates only — not medical advice. Tape measure placement affects Navy results; DEXA or
              hydrostatic weighing is more precise.
            </ResultNote>
          </ResultBody>
        )}
      </ResultCard>
    </CalcLayout>
  );
}
