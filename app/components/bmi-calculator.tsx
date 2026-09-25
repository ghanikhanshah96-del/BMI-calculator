"use client";

import { Eraser, Play, Scale } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CustomSelect, FieldShell, NumberStepper } from "./form-controls";

type UnitMode = "metric" | "us" | "other";
type Gender = "male" | "female";
type ConverterKind = "length" | "weight";

type BmiInputs = {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  heightFeet: number;
  heightInches: number;
  weightLb: number;
};

type BmiResult = {
  bmi: number;
  category: string;
  categoryTone: string;
  healthyBmiMin: number;
  healthyBmiMax: number;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  healthyWeightMinDisplay: string;
  healthyWeightMaxDisplay: string;
  weightUnitLabel: string;
  bmiPrime: number;
  ponderalIndex: number;
  isYouth: boolean;
  heightM: number;
  weightKg: number;
};

const DEFAULT_INPUTS: BmiInputs = {
  age: 25,
  gender: "male",
  heightCm: 180,
  weightKg: 65,
  heightFeet: 5,
  heightInches: 10,
  weightLb: 160,
};

const LENGTH_UNITS = [
  { value: "m", label: "Meter", toMeter: 1 },
  { value: "km", label: "Kilometer", toMeter: 1000 },
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

function getWhoCategory(bmi: number): { label: string; tone: string } {
  if (bmi < 16) return { label: "Severe Thinness", tone: "text-red-700" };
  if (bmi < 17) return { label: "Moderate Thinness", tone: "text-orange-700" };
  if (bmi < 18.5) return { label: "Mild Thinness", tone: "text-amber-700" };
  if (bmi < 25) return { label: "Normal", tone: "text-emerald-700" };
  if (bmi < 30) return { label: "Overweight", tone: "text-amber-700" };
  if (bmi < 35) return { label: "Obese Class I", tone: "text-orange-700" };
  if (bmi < 40) return { label: "Obese Class II", tone: "text-red-700" };
  return { label: "Obese Class III", tone: "text-red-800" };
}

function computeBmiFromMetric(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100;
  if (heightM <= 0 || weightKg <= 0) return null;
  const bmi = weightKg / (heightM * heightM);
  return { bmi, heightM, weightKg };
}

function computeBmiFromUs(weightLb: number, feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  if (totalInches <= 0 || weightLb <= 0) return null;
  const bmi = (703 * weightLb) / (totalInches * totalInches);
  const heightM = totalInches * 0.0254;
  const weightKg = weightLb * 0.45359237;
  return { bmi, heightM, weightKg };
}

function buildResult(
  raw: { bmi: number; heightM: number; weightKg: number },
  age: number,
  unitMode: UnitMode,
): BmiResult {
  const category = getWhoCategory(raw.bmi);
  const healthyWeightMinKg = 18.5 * raw.heightM * raw.heightM;
  const healthyWeightMaxKg = 25 * raw.heightM * raw.heightM;
  const useLb = unitMode === "us";

  return {
    bmi: Number(raw.bmi.toFixed(1)),
    category: category.label,
    categoryTone: category.tone,
    healthyBmiMin: 18.5,
    healthyBmiMax: 25,
    healthyWeightMinKg: Number(healthyWeightMinKg.toFixed(1)),
    healthyWeightMaxKg: Number(healthyWeightMaxKg.toFixed(1)),
    healthyWeightMinDisplay: useLb
      ? (healthyWeightMinKg / 0.45359237).toFixed(1)
      : healthyWeightMinKg.toFixed(1),
    healthyWeightMaxDisplay: useLb
      ? (healthyWeightMaxKg / 0.45359237).toFixed(1)
      : healthyWeightMaxKg.toFixed(1),
    weightUnitLabel: useLb ? "lb" : "kg",
    bmiPrime: Number((raw.bmi / 25).toFixed(2)),
    ponderalIndex: Number((raw.weightKg / (raw.heightM * raw.heightM * raw.heightM)).toFixed(1)),
    isYouth: age < 20,
    heightM: raw.heightM,
    weightKg: raw.weightKg,
  };
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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-white p-2">
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
              <textPath href={`#${curveIds[1]}`}>Normal</textPath>
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

function UnitConverter() {
  const [kind, setKind] = useState<ConverterKind>("length");
  const [fromValue, setFromValue] = useState(180);
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("m");

  const units = kind === "length" ? LENGTH_UNITS : WEIGHT_UNITS;
  const fromOptions = units.map((u) => ({ value: u.value, label: u.label }));
  const toOptions = units.map((u) => ({ value: u.value, label: u.label }));

  const toValue = useMemo(() => {
    if (kind === "length") {
      const from = LENGTH_UNITS.find((u) => u.value === fromUnit);
      const to = LENGTH_UNITS.find((u) => u.value === toUnit);
      if (!from || !to) return 0;
      return (fromValue * from.toMeter) / to.toMeter;
    }
    const from = WEIGHT_UNITS.find((u) => u.value === fromUnit);
    const to = WEIGHT_UNITS.find((u) => u.value === toUnit);
    if (!from || !to) return 0;
    return (fromValue * from.toKg) / to.toKg;
  }, [kind, fromValue, fromUnit, toUnit]);

  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
      <p className="text-sm font-semibold text-emerald-900">
        Unit converter
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        Convert values, then switch to Metric or US Units and enter them in the calculator.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ["length", "Length"],
            ["weight", "Weight"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setKind(id);
              if (id === "length") {
                setFromUnit("cm");
                setToUnit("m");
                setFromValue(180);
              } else {
                setFromUnit("kg");
                setToUnit("lb");
                setFromValue(65);
              }
            }}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
              kind === id
                ? "bg-emerald-700 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-emerald-50",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FieldShell label="From">
          <NumberStepper
            value={fromValue}
            min={0}
            max={1_000_000}
            step={kind === "length" ? 0.1 : 0.1}
            onChange={setFromValue}
          />
          <div className="mt-2">
            <CustomSelect
              value={fromUnit}
              onChange={setFromUnit}
              options={fromOptions}
            />
          </div>
        </FieldShell>
        <FieldShell label="To">
          <p className="text-lg font-semibold text-slate-950">
            {Number.isFinite(toValue) ? Number(toValue.toPrecision(6)) : "—"}
          </p>
          <div className="mt-2">
            <CustomSelect value={toUnit} onChange={setToUnit} options={toOptions} />
          </div>
        </FieldShell>
      </div>
    </div>
  );
}

export default function BmiCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [inputs, setInputs] = useState<BmiInputs>(DEFAULT_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    if (inputs.age < 2 || inputs.age > 120) {
      setError("Age must be between 2 and 120.");
      setResult(null);
      return;
    }

    let raw: { bmi: number; heightM: number; weightKg: number } | null = null;

    if (unitMode === "metric" || unitMode === "other") {
      if (inputs.heightCm <= 0 || inputs.weightKg <= 0) {
        setError("Enter a valid height (cm) and weight (kg).");
        setResult(null);
        return;
      }
      raw = computeBmiFromMetric(inputs.weightKg, inputs.heightCm);
    } else {
      if (inputs.weightLb <= 0 || inputs.heightFeet < 0 || inputs.heightInches < 0) {
        setError("Enter a valid height (ft/in) and weight (lb).");
        setResult(null);
        return;
      }
      if (inputs.heightFeet * 12 + inputs.heightInches <= 0) {
        setError("Height must be greater than zero.");
        setResult(null);
        return;
      }
      raw = computeBmiFromUs(inputs.weightLb, inputs.heightFeet, inputs.heightInches);
    }

    if (!raw || !Number.isFinite(raw.bmi)) {
      setError("Unable to calculate BMI from these values.");
      setResult(null);
      return;
    }

    setError("");
    setResult(buildResult(raw, inputs.age, unitMode === "us" ? "us" : "metric"));
    setAnimationKey((key) => key + 1);
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
          <button
            type="button"
            className={tabClass(unitMode === "other")}
            onClick={() => setUnitMode("other")}
          >
            Other Units
          </button>
        </div>

        {unitMode === "other" && <UnitConverter />}

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldShell label="Age">
            <NumberStepper
              value={inputs.age}
              min={2}
              max={120}
              step={1}
              onChange={(age) => setInputs({ ...inputs, age })}
            />
            <p className="mt-1 text-xs text-slate-500">Ages: 2 – 120</p>
          </FieldShell>
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
        </div>

        {unitMode === "us" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldShell label="Height (feet)">
              <NumberStepper
                value={inputs.heightFeet}
                min={0}
                max={8}
                step={1}
                suffix="ft"
                onChange={(heightFeet) => setInputs({ ...inputs, heightFeet })}
              />
            </FieldShell>
            <FieldShell label="Height (inches)">
              <NumberStepper
                value={inputs.heightInches}
                min={0}
                max={11}
                step={1}
                suffix="in"
                onChange={(heightInches) => setInputs({ ...inputs, heightInches })}
              />
            </FieldShell>
            <FieldShell label="Weight (pounds)">
              <NumberStepper
                value={inputs.weightLb}
                min={1}
                max={1400}
                step={0.5}
                suffix="lb"
                onChange={(weightLb) => setInputs({ ...inputs, weightLb })}
              />
            </FieldShell>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldShell label="Height (cm)">
              <NumberStepper
                value={inputs.heightCm}
                min={50}
                max={300}
                step={1}
                suffix="cm"
                onChange={(heightCm) => setInputs({ ...inputs, heightCm })}
              />
            </FieldShell>
            <FieldShell label="Weight (kg)">
              <NumberStepper
                value={inputs.weightKg}
                min={1}
                max={500}
                step={0.1}
                suffix="kg"
                onChange={(weightKg) => setInputs({ ...inputs, weightKg })}
              />
            </FieldShell>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <Play className="h-4 w-4 fill-current" />
            Calculate
          </button>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Eraser className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      <div
        ref={resultRef}
        id="bmi-result-panel"
        className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between rounded-lg bg-emerald-700 px-4 py-3 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Result</p>
        </div>

        {!result ? (
          <div className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
            <p className="text-lg font-semibold text-slate-900">No result yet</p>
            <p>
              Enter age, gender, height, and weight, then press <strong>Calculate</strong> to see BMI,
              category, healthy ranges, BMI Prime, and Ponderal Index.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Metric: BMI = kg / m²</li>
              <li>US: BMI = 703 × lb / in²</li>
              <li>BMI Prime = BMI / 25</li>
              <li>Ponderal Index = kg / m³</li>
            </ul>
          </div>
        ) : (
          <div
            key={animationKey}
            className="mt-5 space-y-4"
            style={{ animation: "bmiResultIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
          >
            <p className="text-xl font-bold text-slate-900 sm:text-2xl">
              BMI = {result.bmi} kg/m²{" "}
              <span className={result.categoryTone}>({result.category})</span>
            </p>

            <BmiGauge bmi={result.bmi} animationKey={animationKey} />

            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              <li>
                Healthy BMI range: {result.healthyBmiMin} kg/m² – {result.healthyBmiMax} kg/m²
              </li>
              <li>
                Healthy weight for the height: {result.healthyWeightMinDisplay} –{" "}
                {result.healthyWeightMaxDisplay} {result.weightUnitLabel}
              </li>
              <li>BMI Prime: {result.bmiPrime}</li>
              <li>Ponderal Index: {result.ponderalIndex} kg/m³</li>
            </ul>

            {result.isYouth && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                Age {inputs.age} is under 20. CDC uses BMI-for-age percentiles for children and teens.
                The WHO adult category above is shown for reference only.
              </p>
            )}

            <p className="text-xs leading-5 text-slate-500">
              Gender is collected for completeness. Adult WHO BMI cutoffs are the same for men and women.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
