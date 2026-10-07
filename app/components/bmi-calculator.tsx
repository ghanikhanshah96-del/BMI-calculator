"use client";

import { Scale } from "./icons";
import { useEffect, useId, useRef, useState } from "react";
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
  cmFromFeetInches,
  feetInchesFromCm,
  formatCm,
  formatFeetInches,
  formatKg,
  formatLb,
  KG_PER_LB,
  roundTo,
  useUnitConversion,
  type Quantity,
} from "../lib/units";
import { validateFields, type FieldRule } from "../lib/validate";

type UnitMode = "metric" | "us" | "custom";
type Gender = "male" | "female";
type LengthUnit = (typeof LENGTH_UNITS)[number]["value"];
type WeightUnit = (typeof WEIGHT_UNITS)[number]["value"];

type BmiInputs = {
  age: number | null;
  gender: Gender | "";
  heightCm: number | null;
  weightKg: number | null;
  heightFeet: number | null;
  heightInches: number | null;
  weightLb: number | null;
  customHeight: number | null;
  customHeightUnit: LengthUnit | "";
  customWeight: number | null;
  customWeightUnit: WeightUnit | "";
};

type BmiResult = {
  bmi: number;
  category: string;
  categoryTone: string;
  healthyBmiMin: number;
  healthyBmiMax: number;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  showLb: boolean;
  bmiPrime: number;
  ponderalIndex: number;
  isYouth: boolean;
  age: number;
  heightM: number;
  weightKg: number;
};

const EMPTY_INPUTS: BmiInputs = {
  age: null,
  gender: "",
  heightCm: null,
  weightKg: null,
  heightFeet: null,
  heightInches: null,
  weightLb: null,
  customHeight: null,
  customHeightUnit: "",
  customWeight: null,
  customWeightUnit: "",
};

const HEIGHT_CM_RANGE = { min: 50, max: 300 };
const WEIGHT_KG_RANGE = { min: 1, max: 650 };

const LENGTH_UNITS = [
  { value: "cm", label: "Centimeters (cm)", short: "cm", toCm: 1, step: 1, typical: 170, decimals: 1 },
  { value: "m", label: "Meters (m)", short: "m", toCm: 100, step: 0.01, typical: 1.7, decimals: 3 },
  { value: "mm", label: "Millimeters (mm)", short: "mm", toCm: 0.1, step: 10, typical: 1700, decimals: 0 },
  { value: "ft", label: "Feet (ft)", short: "ft", toCm: 30.48, step: 0.1, typical: 5.6, decimals: 2 },
  { value: "in", label: "Inches (in)", short: "in", toCm: 2.54, step: 1, typical: 67, decimals: 1 },
] as const;

const WEIGHT_UNITS = [
  { value: "kg", label: "Kilograms (kg)", short: "kg", toKg: 1, step: 0.1, typical: 70, decimals: 1 },
  { value: "g", label: "Grams (g)", short: "g", toKg: 0.001, step: 100, typical: 70000, decimals: 0 },
  { value: "lb", label: "Pounds (lb)", short: "lb", toKg: KG_PER_LB, step: 0.5, typical: 154, decimals: 1 },
  { value: "oz", label: "Ounces (oz)", short: "oz", toKg: 0.028349523125, step: 1, typical: 2470, decimals: 1 },
] as const;

const lengthUnitOf = (value: string) => LENGTH_UNITS.find((unit) => unit.value === value);
const weightUnitOf = (value: string) => WEIGHT_UNITS.find((unit) => unit.value === value);

const QUANTITIES: ReadonlyArray<Quantity<BmiInputs, UnitMode>> = [
  {
    key: "height",
    fields: (mode) =>
      mode === "metric" ? ["heightCm"] : mode === "us" ? ["heightFeet", "heightInches"] : ["customHeight", "customHeightUnit"],
    toMetric: (inputs, mode) => {
      if (mode === "metric") return inputs.heightCm;
      if (mode === "us") return cmFromFeetInches(inputs.heightFeet, inputs.heightInches);
      const unit = lengthUnitOf(inputs.customHeightUnit);
      return unit && inputs.customHeight !== null ? inputs.customHeight * unit.toCm : null;
    },
    fromMetric: (cm, mode, inputs) => {
      if (mode === "metric") return { heightCm: cm === null ? null : roundTo(cm, 1) };
      if (mode === "us") {
        if (cm === null) return { heightFeet: null, heightInches: null };
        const { feet, inches } = feetInchesFromCm(cm);
        return { heightFeet: feet, heightInches: inches };
      }
      if (cm === null) return { customHeight: null };
      const unit = lengthUnitOf(inputs.customHeightUnit) ?? LENGTH_UNITS[0];
      return { customHeight: roundTo(cm / unit.toCm, unit.decimals), customHeightUnit: unit.value };
    },
  },
  {
    key: "weight",
    fields: (mode) => (mode === "metric" ? ["weightKg"] : mode === "us" ? ["weightLb"] : ["customWeight", "customWeightUnit"]),
    toMetric: (inputs, mode) => {
      if (mode === "metric") return inputs.weightKg;
      if (mode === "us") return inputs.weightLb === null ? null : inputs.weightLb * KG_PER_LB;
      const unit = weightUnitOf(inputs.customWeightUnit);
      return unit && inputs.customWeight !== null ? inputs.customWeight * unit.toKg : null;
    },
    fromMetric: (kg, mode, inputs) => {
      if (mode === "metric") return { weightKg: kg === null ? null : roundTo(kg, 1) };
      if (mode === "us") return { weightLb: kg === null ? null : roundTo(kg / KG_PER_LB, 1) };
      if (kg === null) return { customWeight: null };
      const unit = weightUnitOf(inputs.customWeightUnit) ?? WEIGHT_UNITS[0];
      return { customWeight: roundTo(kg / unit.toKg, unit.decimals), customWeightUnit: unit.value };
    },
  },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const UNIT_OPTIONS = [
  { value: "us", label: "Imperial" },
  { value: "metric", label: "Metric" },
  { value: "custom", label: "Custom" },
] as const;

/** Labels match the adult category tables on the page; underweight tone still deepens below 17 and 16. */
function getAdultCategory(bmi: number): { label: string; tone: string } {
  if (bmi < 16) return { label: "Underweight", tone: "text-red-700" };
  if (bmi < 17) return { label: "Underweight", tone: "text-orange-700" };
  if (bmi < 18.5) return { label: "Underweight", tone: "text-amber-700" };
  if (bmi < 25) return { label: "Healthy Weight", tone: "text-emerald-700" };
  if (bmi < 30) return { label: "Overweight", tone: "text-amber-700" };
  if (bmi < 35) return { label: "Obesity Class 1", tone: "text-orange-700" };
  if (bmi < 40) return { label: "Obesity Class 2", tone: "text-red-700" };
  return { label: "Obesity Class 3", tone: "text-red-800" };
}

function buildResult(heightM: number, weightKg: number, age: number, showLb: boolean): BmiResult {
  const bmi = weightKg / (heightM * heightM);
  const category = getAdultCategory(bmi);
  return {
    bmi: Number(bmi.toFixed(1)),
    category: category.label,
    categoryTone: category.tone,
    healthyBmiMin: 18.5,
    healthyBmiMax: 25,
    healthyWeightMinKg: 18.5 * heightM * heightM,
    healthyWeightMaxKg: 25 * heightM * heightM,
    showLb,
    bmiPrime: Number((bmi / 25).toFixed(2)),
    ponderalIndex: Number((weightKg / (heightM * heightM * heightM)).toFixed(1)),
    isYouth: age < 20,
    age,
    heightM,
    weightKg,
  };
}

/** Presence-only rules so one message can list every empty field; ranges are checked in readMeasurements. */
function requiredMeasurements(inputs: BmiInputs, unitMode: UnitMode): FieldRule[] {
  if (unitMode === "metric") {
    return [
      { label: "height", value: inputs.heightCm },
      { label: "weight", value: inputs.weightKg },
    ];
  }
  if (unitMode === "us") {
    return [
      { label: "height in feet", value: inputs.heightFeet },
      { label: "weight", value: inputs.weightLb },
    ];
  }
  return [
    { label: "height", value: inputs.customHeight },
    { label: "weight", value: inputs.customWeight },
    { label: "height unit", value: inputs.customHeightUnit, kind: "choice" },
    { label: "weight unit", value: inputs.customWeightUnit, kind: "choice" },
  ];
}

/** Range checks on the exact metric values, worded in the unit system the user is looking at. */
function measurementError(inputs: BmiInputs, unitMode: UnitMode, heightCm: number, weightKg: number) {
  if (unitMode === "us") {
    const inchesError = validateFields([{ label: "inches", value: inputs.heightInches ?? 0, min: 0, max: 11.9, unit: "in" }]);
    if (inchesError) return inchesError;
  }
  const suffix = unitMode === "custom" ? " (converted)" : "";
  return (
    checkRange(`height${suffix}`, heightCm, [HEIGHT_CM_RANGE.min, HEIGHT_CM_RANGE.max], unitMode === "us" ? formatFeetInches : formatCm) ||
    checkRange(`weight${suffix}`, weightKg, [WEIGHT_KG_RANGE.min, WEIGHT_KG_RANGE.max], unitMode === "us" ? formatLb : formatKg)
  );
}

/** Needle angles calibrated to calculator.net gauge (BMI 20.1 ≈ 42.6°). */
const BMI_ANGLE_STOPS: Array<{ bmi: number; angle: number }> = [
  { bmi: 13, angle: 0 },
  { bmi: 16, angle: 12 },
  { bmi: 17, angle: 18 },
  { bmi: 18.5, angle: 28 },
  { bmi: 25, angle: 85 },
  { bmi: 30, angle: 112 },
  { bmi: 35, angle: 140 },
  { bmi: 40, angle: 165 },
  { bmi: 47, angle: 180 },
];

function bmiToNeedleAngle(bmi: number) {
  const clamped = Math.min(47, Math.max(13, bmi));
  for (let i = 0; i < BMI_ANGLE_STOPS.length - 1; i += 1) {
    const a = BMI_ANGLE_STOPS[i];
    const b = BMI_ANGLE_STOPS[i + 1];
    if (clamped >= a.bmi && clamped <= b.bmi) {
      const t = (clamped - a.bmi) / (b.bmi - a.bmi);
      return a.angle + t * (b.angle - a.angle);
    }
  }
  return 180;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function BmiGauge({ bmi, animationKey }: { bmi: number; animationKey: number }) {
  const uid = useId().replace(/:/g, "");
  const targetAngle = Number(bmiToNeedleAngle(bmi).toFixed(2));
  const needleRef = useRef<SVGLineElement>(null);
  const markerId = `bmi-arrow-${uid}-${animationKey}`;
  const curveIds = [1, 2, 3, 4].map((n) => `bmi-curve-${uid}-${animationKey}-${n}`);

  useEffect(() => {
    const needle = needleRef.current;
    if (!needle) return;

    let frame = 0;
    let start: number | null = null;
    const duration = 850;
    needle.setAttribute("transform", "rotate(0 140 140)");

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const angle = targetAngle * easeOutCubic(progress);
      needle.setAttribute("transform", `rotate(${angle} 140 140)`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animationKey, targetAngle]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-b from-slate-50 to-white p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 163"
        className="mx-auto h-auto w-full max-w-[320px]"
        role="img"
        aria-label={`BMI gauge pointing to ${bmi.toFixed(1)}`}
      >
        <g transform="translate(18,18)" style={{ fontFamily: "inherit", fontSize: 12 }}>
          <defs>
            <marker
              id={markerId}
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
            </marker>
            <path id={curveIds[0]} d="M-4 140 A140 140, 0, 0, 1, 284 140" fill="none" />
            <path id={curveIds[1]} d="M33 43.6 A140 140, 0, 0, 1, 280 140" fill="none" />
            <path id={curveIds[2]} d="M95 3 A140 140, 0, 0, 1, 284 140" fill="none" />
            <path id={curveIds[3]} d="M235.4 33 A140 140, 0, 0, 1, 284 140" fill="none" />
          </defs>
          <path d="M0 140 A140 140, 0, 0, 1, 6.9 96.7 L140 140 Z" fill="#bc2020" />
          <path d="M6.9 96.7 A140 140, 0, 0, 1, 12.1 83.1 L140 140 Z" fill="#d38888" />
          <path d="M12.1 83.1 A140 140, 0, 0, 1, 22.6 63.8 L140 140 Z" fill="#ffe400" />
          <path d="M22.6 63.8 A140 140, 0, 0, 1, 96.7 6.9 L140 140 Z" fill="#008137" />
          <path d="M96.7 6.9 A140 140, 0, 0, 1, 169.1 3.1 L140 140 Z" fill="#ffe400" />
          <path d="M169.1 3.1 A140 140, 0, 0, 1, 233.7 36 L140 140 Z" fill="#d38888" />
          <path d="M233.7 36 A140 140, 0, 0, 1, 273.1 96.7 L140 140 Z" fill="#bc2020" />
          <path d="M273.1 96.7 A140 140, 0, 0, 1, 280 140 L140 140 Z" fill="#8a0101" />
          <path d="M45 140 A90 90, 0, 0, 1, 230 140 Z" fill="#fff" />
          <circle cx="140" cy="140" r="6" fill="#334155" />
          <g style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 2, fill: "#0f172a" }}>
            <text x="25" y="111" transform="rotate(-72, 25, 111)">
              16
            </text>
            <text x="30" y="96" transform="rotate(-66, 30, 96)">
              17
            </text>
            <text x="35" y="83" transform="rotate(-57, 35, 83)">
              18.5
            </text>
            <text x="97" y="29" transform="rotate(-18, 97, 29)">
              25
            </text>
            <text x="157" y="20" transform="rotate(12, 157, 20)">
              30
            </text>
            <text x="214" y="45" transform="rotate(42, 214, 45)">
              35
            </text>
            <text x="252" y="95" transform="rotate(72, 252, 95)">
              40
            </text>
          </g>
          <g style={{ fontSize: 12, fill: "#1e293b", fontWeight: 600 }}>
            <text>
              <textPath href={`#${curveIds[0]}`}>Underweight</textPath>
            </text>
            <text>
              <textPath href={`#${curveIds[1]}`}>Healthy</textPath>
            </text>
            <text>
              <textPath href={`#${curveIds[2]}`}>Overweight</textPath>
            </text>
            <text>
              <textPath href={`#${curveIds[3]}`}>Obesity</textPath>
            </text>
          </g>
          <line
            ref={needleRef}
            x1="140"
            y1="140"
            x2="55"
            y2="140"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
            transform="rotate(0 140 140)"
          />
          <text
            x="150"
            y="118"
            textAnchor="middle"
            style={{ fontSize: 28, fontWeight: 800, fill: "#0f172a" }}
          >
            BMI = {bmi.toFixed(1)}
          </text>
        </g>
      </svg>
    </div>
  );
}

const kgToLb = (kg: number) => kg / KG_PER_LB;

function OtherUnitsPanel({ result }: { result: BmiResult }) {
  const rows = [
    {
      key: "height",
      cells: [
        "Height",
        `${(result.heightM * 100).toFixed(1)} cm · ${result.heightM.toFixed(2)} m`,
        formatFeetInches(result.heightM * 100),
      ],
    },
    {
      key: "weight",
      cells: ["Weight", `${result.weightKg.toFixed(1)} kg`, `${kgToLb(result.weightKg).toFixed(1)} lb`],
    },
    {
      key: "healthy",
      cells: [
        "Healthy weight",
        `${result.healthyWeightMinKg.toFixed(1)} – ${result.healthyWeightMaxKg.toFixed(1)} kg`,
        `${kgToLb(result.healthyWeightMinKg).toFixed(1)} – ${kgToLb(result.healthyWeightMaxKg).toFixed(1)} lb`,
      ],
    },
  ];
  return (
    <div className="space-y-2">
      <SectionTitle title="Your numbers in other units" hint="Metric and imperial values for the same measurements." />
      <ResultTable caption="Your numbers in metric and imperial units" head={["", "Metric", "Imperial"]} align={["left", "right", "right"]} rows={rows} />
    </div>
  );
}

export default function BmiCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [inputs, setInputs] = useState<BmiInputs>(EMPTY_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const units = useUnitConversion(QUANTITIES);

  const update = (patch: Partial<BmiInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
    if ([patch.gender, patch.customHeightUnit, patch.customWeightUnit].includes("")) setResult(null);
  };
  const lengthUnit = LENGTH_UNITS.find((unit) => unit.value === inputs.customHeightUnit);
  const weightUnit = WEIGHT_UNITS.find((unit) => unit.value === inputs.customWeightUnit);

  /** `silent` runs after a unit switch: an incomplete form just shows no result instead of an error. */
  const run = (values: BmiInputs, mode: UnitMode, silent = false) => {
    const exact = units.metric(values, mode);
    const message =
      validateFields([
        { label: "age", value: values.age, min: 2, max: 120 },
        ...requiredMeasurements(values, mode),
        { label: "gender", value: values.gender, kind: "choice" },
      ]) || measurementError(values, mode, exact.height!, exact.weight!);
    if (message) {
      setError(silent ? "" : message);
      setResult(null);
      return;
    }

    const showLb = mode === "us" || values.customWeightUnit === "lb" || values.customWeightUnit === "oz";
    setError("");
    setResult(buildResult(exact.height! / 100, exact.weight!, values.age!, mode !== "metric" && showLb));
    setAnimationKey((key) => key + 1);
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

  const healthyRange = result
    ? result.showLb
      ? `${kgToLb(result.healthyWeightMinKg).toFixed(1)} – ${kgToLb(result.healthyWeightMaxKg).toFixed(1)}`
      : `${result.healthyWeightMinKg.toFixed(1)} – ${result.healthyWeightMaxKg.toFixed(1)}`
    : "";

  const measurementHint = unitMode === "us" ? "ft · in · lb" : unitMode === "metric" ? "cm · kg" : "Pick any unit";

  return (
    <CalcLayout>
      <CalcForm>
        <CalcHeader
          icon={Scale}
          niche="bmi"
          eyebrow="BMI"
          title="Body Mass Index"
          description="Check your BMI category and healthy weight range in seconds."
        />

        <SegmentedControl label="Unit system" options={UNIT_OPTIONS} value={unitMode} onChange={changeUnit} />

        <InputGroup step={1} title="Your details">
          <FieldShell label="Age">
            <NumberStepper value={inputs.age} min={2} max={120} step={1} placeholder={25} onChange={(age) => update({ age })} />
          </FieldShell>
          <FieldShell label="Gender">
            <CustomSelect
              value={inputs.gender}
              placeholder="Select gender"
              onChange={(gender) => update({ gender: gender as Gender })}
              options={GENDER_OPTIONS}
            />
          </FieldShell>
        </InputGroup>

        <InputGroup step={2} title="Measurements" hint={measurementHint}>
          {unitMode === "us" ? (
            <>
              <FieldShell label="Height">
                <div className="grid grid-cols-2 gap-2">
                  <NumberStepper
                    value={inputs.heightFeet}
                    min={1}
                    max={9}
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
                    placeholder={10}
                    onChange={(heightInches) => update({ heightInches })}
                  />
                </div>
              </FieldShell>
              <FieldShell label="Weight">
                <NumberStepper
                  value={inputs.weightLb}
                  min={2}
                  max={1400}
                  step={0.5}
                  suffix="lb"
                  placeholder={160}
                  onChange={(weightLb) => update({ weightLb })}
                />
              </FieldShell>
            </>
          ) : unitMode === "metric" ? (
            <>
              <FieldShell label="Height">
                <NumberStepper
                  value={inputs.heightCm}
                  min={HEIGHT_CM_RANGE.min}
                  max={HEIGHT_CM_RANGE.max}
                  step={1}
                  suffix="cm"
                  placeholder={175}
                  onChange={(heightCm) => update({ heightCm })}
                />
              </FieldShell>
              <FieldShell label="Weight">
                <NumberStepper
                  value={inputs.weightKg}
                  min={WEIGHT_KG_RANGE.min}
                  max={WEIGHT_KG_RANGE.max}
                  step={0.1}
                  suffix="kg"
                  placeholder={70}
                  onChange={(weightKg) => update({ weightKg })}
                />
              </FieldShell>
            </>
          ) : (
            <>
              <FieldShell label="Height">
                <NumberStepper
                  value={inputs.customHeight}
                  min={0}
                  max={lengthUnit ? Math.ceil(HEIGHT_CM_RANGE.max / lengthUnit.toCm) : 100000}
                  step={lengthUnit?.step ?? 1}
                  placeholder={lengthUnit?.typical}
                  onChange={(customHeight) => update({ customHeight })}
                  addon={
                    <CustomSelect
                      variant="unit"
                      ariaLabel="Height unit"
                      placeholder="Unit"
                      value={inputs.customHeightUnit}
                      onChange={(unit) => update({ customHeightUnit: unit as LengthUnit })}
                      options={LENGTH_UNITS.map((unit) => ({ value: unit.value, label: unit.label }))}
                    />
                  }
                />
              </FieldShell>
              <FieldShell label="Weight">
                <NumberStepper
                  value={inputs.customWeight}
                  min={0}
                  max={weightUnit ? Math.ceil(WEIGHT_KG_RANGE.max / weightUnit.toKg) : 1000000}
                  step={weightUnit?.step ?? 1}
                  placeholder={weightUnit?.typical}
                  onChange={(customWeight) => update({ customWeight })}
                  addon={
                    <CustomSelect
                      variant="unit"
                      ariaLabel="Weight unit"
                      placeholder="Unit"
                      value={inputs.customWeightUnit}
                      onChange={(unit) => update({ customWeightUnit: unit as WeightUnit })}
                      options={WEIGHT_UNITS.map((unit) => ({ value: unit.value, label: unit.label }))}
                    />
                  }
                />
              </FieldShell>
            </>
          )}
        </InputGroup>

        <FormError message={error} />

        <ActionBar onCalculate={calculate} onClear={clear} />
      </CalcForm>

      <ResultCard resultRef={resultRef} id="bmi-result-panel">
        {!result ? (
          <EmptyResult
            label="Body Mass Index"
            unit="kg/m²"
            stats={["Healthy weight", "Category", "BMI Prime", "Ponderal Index"]}
            rows={["Height", "Weight", "Healthy weight range"]}
          />
        ) : (
          <ResultBody animationKey={animationKey}>
            <ResultHero label="Body Mass Index" value={result.bmi} unit="kg/m²" badge={result.category}>
              Healthy BMI range: {result.healthyBmiMin} – {result.healthyBmiMax} kg/m²
            </ResultHero>

            <BmiGauge bmi={result.bmi} animationKey={animationKey} />

            <OtherUnitsPanel result={result} />

            <StatGrid>
              <StatTile
                tone="emerald"
                label="Healthy weight"
                value={healthyRange}
                hint={`${result.showLb ? "lb" : "kg"} for your height`}
              />
              <StatTile label="Category" value={<span className={result.categoryTone}>{result.category}</span>} hint="Adult BMI categories" />
              <StatTile label="BMI Prime" value={result.bmiPrime} hint="BMI ÷ 25" />
              <StatTile label="Ponderal Index" value={result.ponderalIndex} hint="kg/m³" />
            </StatGrid>

            {result.isYouth && (
              <ResultNote tone="warning">
                Age {result.age} is under 20. For ages 2 through 19, BMI is interpreted with age- and sex-specific
                percentiles, so the adult category above is shown for reference only.
              </ResultNote>
            )}

            <ResultNote>
              Gender is collected for completeness. Adult BMI categories are the same for men and women.
            </ResultNote>
          </ResultBody>
        )}
      </ResultCard>
    </CalcLayout>
  );
}
