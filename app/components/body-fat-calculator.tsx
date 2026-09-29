"use client";

import { HeartPulse } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

type UnitMode = "us" | "metric" | "other";
type Gender = "male" | "female";
type ConverterKind = "length" | "weight";

type LengthParts = { feet: number; inches: number };

type BodyFatInputs = {
  gender: Gender;
  age: number;
  weightLb: number;
  weightKg: number;
  height: LengthParts;
  neck: LengthParts;
  waist: LengthParts;
  hip: LengthParts;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm: number;
};

type AceCategory = "Essential" | "Athletes" | "Fitness" | "Average" | "Obese";

type BodyFatResult = {
  navyPct: number;
  bmiPct: number;
  category: AceCategory;
  categoryTone: string;
  fatMass: number;
  leanMass: number;
  idealPct: number;
  fatToLose: number;
  weightUnit: "lbs" | "kg";
  gender: Gender;
};

const LENGTH_UNITS = [
  { value: "m", label: "Meter", toMeter: 1 },
  { value: "cm", label: "Centimeter", toMeter: 0.01 },
  { value: "mm", label: "Millimeter", toMeter: 0.001 },
  { value: "ft", label: "Foot", toMeter: 0.3048 },
  { value: "in", label: "Inch", toMeter: 0.0254 },
] as const;

const WEIGHT_UNITS = [
  { value: "kg", label: "Kilogram", toKg: 1 },
  { value: "g", label: "Gram", toKg: 0.001 },
  { value: "lb", label: "Pound", toKg: 0.45359237 },
  { value: "oz", label: "Ounce", toKg: 0.028349523125 },
] as const;

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

const DEFAULT_INPUTS: BodyFatInputs = {
  gender: "male",
  age: 25,
  weightLb: 152,
  weightKg: 70,
  height: { feet: 5, inches: 10.5 },
  neck: { feet: 1, inches: 7.5 },
  waist: { feet: 3, inches: 1.5 },
  hip: { feet: 2, inches: 10.5 },
  heightCm: 178,
  neckCm: 50,
  waistCm: 96,
  hipCm: 92,
};

function toTotalInches(parts: LengthParts) {
  return parts.feet * 12 + parts.inches;
}

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
      // Keep marker inset so it never sits on the clipped edges
      const start = (i / n) * 100;
      const width = 100 / n;
      return start + t * width;
    }
  }
  return 50;
}

/** U.S. Navy method — USC inches formulas (same as calculator.net) */
function navyBodyFatPercent(
  gender: Gender,
  heightIn: number,
  neckIn: number,
  waistIn: number,
  hipIn: number,
) {
  if (gender === "male") {
    if (waistIn <= neckIn || heightIn <= 0) return null;
    return 86.01 * log10(waistIn - neckIn) - 70.041 * log10(heightIn) + 36.76;
  }
  if (waistIn + hipIn <= neckIn || heightIn <= 0) return null;
  return 163.205 * log10(waistIn + hipIn - neckIn) - 97.684 * log10(heightIn) - 78.387;
}

function bmiBodyFatPercent(gender: Gender, age: number, bmi: number) {
  if (age < 18) {
    return gender === "male"
      ? 1.51 * bmi - 0.7 * age - 2.2
      : 1.51 * bmi - 0.7 * age + 1.4;
  }
  return gender === "male"
    ? 1.2 * bmi + 0.23 * age - 16.2
    : 1.2 * bmi + 0.23 * age - 5.4;
}

function UsLengthInputs({
  value,
  onChange,
  maxFeet = 8,
}: {
  value: LengthParts;
  onChange: (next: LengthParts) => void;
  maxFeet?: number;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <NumberStepper
        value={value.feet}
        min={0}
        max={maxFeet}
        step={1}
        suffix="ft"
        onChange={(feet) => onChange({ ...value, feet })}
      />
      <NumberStepper
        value={value.inches}
        min={0}
        max={11.9}
        step={0.5}
        suffix="in"
        onChange={(inches) => onChange({ ...value, inches })}
      />
    </div>
  );
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
          {/* Marker */}
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

          {/* Clear segment bar (not a muddy blend) */}
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
                title={`${seg.key}: ${seg.from}–${seg.to === segments[segments.length - 1].to ? `${seg.from}+` : seg.to}%`}
              />
            ))}
          </div>
        </div>

        {/* Labels under each segment — never clipped */}
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

      <div
        className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm"
        style={{ backgroundColor: `${active.color}18` }}
      >
        <span
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: active.color }}
          aria-hidden
        />
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

function UnitConverter() {
  const [kind, setKind] = useState<ConverterKind>("length");
  const [fromUnit, setFromUnit] = useState("in");
  const [toUnit, setToUnit] = useState("cm");
  const [amount, setAmount] = useState(1);

  const converted = useMemo(() => {
    if (kind === "length") {
      const from = LENGTH_UNITS.find((u) => u.value === fromUnit);
      const to = LENGTH_UNITS.find((u) => u.value === toUnit);
      if (!from || !to) return 0;
      return (amount * from.toMeter) / to.toMeter;
    }
    const from = WEIGHT_UNITS.find((u) => u.value === fromUnit);
    const to = WEIGHT_UNITS.find((u) => u.value === toUnit);
    if (!from || !to) return 0;
    return (amount * from.toKg) / to.toKg;
  }, [kind, fromUnit, toUnit, amount]);

  const units = kind === "length" ? LENGTH_UNITS : WEIGHT_UNITS;

  return (
    <div className="space-y-3 rounded-2xl bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 ring-1 ring-emerald-100">
      <p className="text-sm font-semibold text-emerald-900">Unit converter</p>
      <SegmentedControl
        label="Converter type"
        size="sm"
        options={[
          { value: "length", label: "Length" },
          { value: "weight", label: "Weight" },
        ]}
        value={kind}
        onChange={(id) => {
          setKind(id);
          if (id === "length") {
            setFromUnit("in");
            setToUnit("cm");
          } else {
            setFromUnit("lb");
            setToUnit("kg");
          }
        }}
      />
      <FieldShell label="Amount">
        <NumberStepper value={amount} min={0} max={99999} step={0.1} onChange={setAmount} />
      </FieldShell>
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldShell label="From">
          <CustomSelect
            value={fromUnit}
            onChange={setFromUnit}
            options={units.map((u) => ({ value: u.value, label: u.label }))}
          />
        </FieldShell>
        <FieldShell label="To">
          <CustomSelect
            value={toUnit}
            onChange={setToUnit}
            options={units.map((u) => ({ value: u.value, label: u.label }))}
          />
        </FieldShell>
      </div>
      <p className="rounded-xl bg-white px-4 py-3 text-lg font-semibold text-slate-950 ring-1 ring-emerald-100">
        {Number.isFinite(converted) ? converted.toFixed(4) : "—"}{" "}
        <span className="text-sm font-semibold text-slate-600">{toUnit}</span>
      </p>
    </div>
  );
}

export default function BodyFatCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("us");
  const [inputs, setInputs] = useState<BodyFatInputs>(DEFAULT_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BodyFatResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    if (inputs.age < 10 || inputs.age > 120) {
      setError("Age must be between 10 and 120.");
      setResult(null);
      return;
    }

    let heightIn: number;
    let neckIn: number;
    let waistIn: number;
    let hipIn: number;
    let weight: number;
    let weightUnit: "lbs" | "kg";
    let heightM: number;
    let weightKg: number;

    if (unitMode === "metric" || unitMode === "other") {
      if (inputs.weightKg <= 0 || inputs.heightCm <= 0) {
        setError("Enter a valid weight and height.");
        setResult(null);
        return;
      }
      heightIn = inputs.heightCm / 2.54;
      neckIn = inputs.neckCm / 2.54;
      waistIn = inputs.waistCm / 2.54;
      hipIn = inputs.hipCm / 2.54;
      weight = inputs.weightKg;
      weightUnit = "kg";
      heightM = inputs.heightCm / 100;
      weightKg = inputs.weightKg;
    } else {
      heightIn = toTotalInches(inputs.height);
      neckIn = toTotalInches(inputs.neck);
      waistIn = toTotalInches(inputs.waist);
      hipIn = toTotalInches(inputs.hip);
      if (inputs.weightLb <= 0 || heightIn <= 0) {
        setError("Enter a valid weight and height.");
        setResult(null);
        return;
      }
      weight = inputs.weightLb;
      weightUnit = "lbs";
      heightM = heightIn * 0.0254;
      weightKg = inputs.weightLb * 0.45359237;
    }

    const navy = navyBodyFatPercent(inputs.gender, heightIn, neckIn, waistIn, hipIn);
    if (navy === null || !Number.isFinite(navy)) {
      setError(
        inputs.gender === "male"
          ? "Waist must be larger than neck for a valid Navy estimate."
          : "Waist + hip must be larger than neck for a valid Navy estimate.",
      );
      setResult(null);
      return;
    }

    const bmi = weightKg / (heightM * heightM);
    const bmiPct = bmiBodyFatPercent(inputs.gender, inputs.age, bmi);
    const ace = getAceCategory(inputs.gender, navy);
    const fatMass = weight * (navy / 100);
    const leanMass = weight - fatMass;
    const idealPct = interpolateIdeal(inputs.age, inputs.gender);
    const fatToLose = navy > idealPct ? weight * ((navy - idealPct) / 100) : 0;

    setError("");
    setResult({
      navyPct: Number(navy.toFixed(1)),
      bmiPct: Number(bmiPct.toFixed(1)),
      category: ace.label,
      categoryTone: ace.tone,
      fatMass: Number(fatMass.toFixed(1)),
      leanMass: Number(leanMass.toFixed(1)),
      idealPct: Number(idealPct.toFixed(1)),
      fatToLose: Number(fatToLose.toFixed(1)),
      weightUnit,
      gender: inputs.gender,
    });
    setAnimationKey((k) => k + 1);
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const clear = () => {
    setInputs(DEFAULT_INPUTS);
    setUnitMode("us");
    setError("");
    setResult(null);
  };

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
            { value: "us", label: "US Units" },
            { value: "metric", label: "Metric" },
            { value: "other", label: "Other" },
          ]}
          value={unitMode}
          onChange={setUnitMode}
        />

        {unitMode === "other" ? (
          <UnitConverter />
        ) : (
          <>
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
                  min={10}
                  max={120}
                  step={1}
                  onChange={(age) => setInputs({ ...inputs, age })}
                />
              </FieldShell>
            </InputGroup>

            {unitMode === "us" ? (
              <InputGroup step={2} title="Measurements" hint="lb · ft · in" columns={1}>
                <FieldShell label="Weight">
                  <NumberStepper
                    value={inputs.weightLb}
                    min={50}
                    max={500}
                    step={0.5}
                    suffix="lb"
                    onChange={(weightLb) => setInputs({ ...inputs, weightLb })}
                  />
                </FieldShell>
                <FieldShell label="Height">
                  <UsLengthInputs
                    value={inputs.height}
                    onChange={(height) => setInputs({ ...inputs, height })}
                    maxFeet={7}
                  />
                </FieldShell>
                <FieldShell label="Neck">
                  <UsLengthInputs
                    value={inputs.neck}
                    onChange={(neck) => setInputs({ ...inputs, neck })}
                    maxFeet={2}
                  />
                </FieldShell>
                <FieldShell label="Waist">
                  <UsLengthInputs
                    value={inputs.waist}
                    onChange={(waist) => setInputs({ ...inputs, waist })}
                    maxFeet={5}
                  />
                </FieldShell>
                {inputs.gender === "female" ? (
                  <FieldShell label="Hip">
                    <UsLengthInputs
                      value={inputs.hip}
                      onChange={(hip) => setInputs({ ...inputs, hip })}
                      maxFeet={5}
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
                    max={250}
                    step={0.5}
                    suffix="kg"
                    onChange={(weightKg) => setInputs({ ...inputs, weightKg })}
                  />
                </FieldShell>
                <FieldShell label="Height">
                  <NumberStepper
                    value={inputs.heightCm}
                    min={100}
                    max={250}
                    step={0.5}
                    suffix="cm"
                    onChange={(heightCm) => setInputs({ ...inputs, heightCm })}
                  />
                </FieldShell>
                <FieldShell label="Neck">
                  <NumberStepper
                    value={inputs.neckCm}
                    min={20}
                    max={80}
                    step={0.5}
                    suffix="cm"
                    onChange={(neckCm) => setInputs({ ...inputs, neckCm })}
                  />
                </FieldShell>
                <FieldShell label="Waist">
                  <NumberStepper
                    value={inputs.waistCm}
                    min={40}
                    max={200}
                    step={0.5}
                    suffix="cm"
                    onChange={(waistCm) => setInputs({ ...inputs, waistCm })}
                  />
                </FieldShell>
                {inputs.gender === "female" ? (
                  <FieldShell label="Hip">
                    <NumberStepper
                      value={inputs.hipCm}
                      min={40}
                      max={200}
                      step={0.5}
                      suffix="cm"
                      onChange={(hipCm) => setInputs({ ...inputs, hipCm })}
                    />
                  </FieldShell>
                ) : null}
              </InputGroup>
            )}
          </>
        )}

        <FormError message={error} />

        {unitMode !== "other" ? <ActionBar onCalculate={calculate} onClear={clear} /> : null}
      </CalcForm>

      <ResultCard resultRef={resultRef}>
        {!result ? (
          <EmptyResult
            icon={HeartPulse}
            text={
              <>
                Enter gender, age, weight, height, neck, and waist
                {inputs.gender === "female" ? " (plus hip)" : ""}, then press <strong>Calculate</strong> for
                U.S. Navy body fat, ACE category, lean mass, and a BMI-method estimate.
              </>
            }
            formulas={["U.S. Navy method", "BMI-based estimate", "Jackson & Pollock ideal %"]}
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
              <StatTile tone="amber" label="Fat mass" value={`${result.fatMass} ${result.weightUnit}`} />
              <StatTile tone="emerald" label="Lean mass" value={`${result.leanMass} ${result.weightUnit}`} />
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
                    result.fatToLose > 0 ? `${result.fatToLose} ${result.weightUnit}` : "At or below ideal",
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
