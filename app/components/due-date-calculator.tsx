"use client";

import { CalendarHeart } from "./icons";
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
  StatGrid,
  StatTile,
} from "./calc-ui";
import { CustomSelect, DatePicker, FieldShell, NumberStepper, useToday } from "./form-controls";
import { validateFields } from "../lib/validate";

type MethodId = "lmp" | "conception" | "ultrasound" | "ivf";
type IvfEmbryo = "day3" | "day5";

/** Empty date strings mean "today" until the user picks a date. */
type DueDateInputs = {
  method: MethodId;
  lmp: string;
  conception: string;
  ultrasoundDate: string;
  ultrasoundWeeks: number | null;
  ultrasoundDays: number | null;
  ivfDate: string;
  ivfEmbryo: IvfEmbryo | "";
};

type DueDateResult = {
  dueDate: Date;
  conceptionEstimate: Date;
  lmpEstimate: Date;
  gestationalWeeks: number;
  gestationalDays: number;
  trimester: string;
  isPastDue: boolean;
  daysPastDue: number;
  weeksPastDue: number;
  daysRemaining: number;
  methodLabel: string;
};

const MS_DAY = 24 * 60 * 60 * 1000;

const EMPTY_INPUTS: DueDateInputs = {
  method: "lmp",
  lmp: "",
  conception: "",
  ultrasoundDate: "",
  ultrasoundWeeks: null,
  ultrasoundDays: null,
  ivfDate: "",
  ivfEmbryo: "",
};

function parseLocalDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * MS_DAY);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function methodLabel(method: MethodId) {
  if (method === "lmp") return "Last menstrual period";
  if (method === "conception") return "Conception date";
  if (method === "ultrasound") return "Ultrasound date";
  return "IVF transfer date";
}

function buildResult(
  inputs: DueDateInputs,
): { ok: true; result: DueDateResult } | { ok: false; error: string } {
  let dueDate: Date | null = null;
  let conceptionEstimate: Date | null = null;
  let lmpEstimate: Date | null = null;

  if (inputs.method === "lmp") {
    const lmp = parseLocalDate(inputs.lmp);
    if (!lmp) return { ok: false, error: "Enter a valid LMP date." };
    dueDate = addDays(lmp, 280);
    lmpEstimate = lmp;
    conceptionEstimate = addDays(lmp, 14);
  } else if (inputs.method === "conception") {
    const conception = parseLocalDate(inputs.conception);
    if (!conception) return { ok: false, error: "Enter a valid conception date." };
    dueDate = addDays(conception, 266);
    conceptionEstimate = conception;
    lmpEstimate = addDays(conception, -14);
  } else if (inputs.method === "ultrasound") {
    const scan = parseLocalDate(inputs.ultrasoundDate);
    if (!scan) return { ok: false, error: "Enter a valid ultrasound date." };
    const error = validateFields([
      { label: "gestational weeks at the scan", value: inputs.ultrasoundWeeks, min: 0, max: 42 },
      { label: "extra days", value: inputs.ultrasoundDays ?? 0, min: 0, max: 6 },
    ]);
    if (error) return { ok: false, error };
    const gaDays = inputs.ultrasoundWeeks! * 7 + (inputs.ultrasoundDays ?? 0);
    dueDate = addDays(scan, 280 - gaDays);
    lmpEstimate = addDays(dueDate, -280);
    conceptionEstimate = addDays(lmpEstimate, 14);
  } else {
    const transfer = parseLocalDate(inputs.ivfDate);
    if (!transfer) return { ok: false, error: "Enter a valid IVF transfer date." };
    const error = validateFields([{ label: "embryo age at transfer", value: inputs.ivfEmbryo, kind: "choice" }]);
    if (error) return { ok: false, error };
    // calculator.net: day-3 → +263, day-5 → +261 from transfer
    dueDate = addDays(transfer, inputs.ivfEmbryo === "day3" ? 263 : 261);
    lmpEstimate = addDays(dueDate, -280);
    conceptionEstimate = addDays(lmpEstimate, 14);
  }

  if (!dueDate || !conceptionEstimate || !lmpEstimate) {
    return { ok: false, error: "Unable to calculate due date from these values." };
  }

  const today = startOfToday();
  const daysFromLmp = Math.floor((today.getTime() - lmpEstimate.getTime()) / MS_DAY);
  const isPastDue = today.getTime() > dueDate.getTime();
  const daysPastDue = isPastDue
    ? Math.floor((today.getTime() - dueDate.getTime()) / MS_DAY)
    : 0;
  const weeksPastDue = isPastDue ? Math.floor(daysPastDue / 7) : 0;
  const daysRemaining = isPastDue
    ? 0
    : Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / MS_DAY));

  let gestationalWeeks = 0;
  let gestationalDays = 0;
  let trimester = "Trimester 3";

  if (isPastDue) {
    trimester = "Past due date";
    gestationalWeeks = Math.floor(daysFromLmp / 7);
    gestationalDays = ((daysFromLmp % 7) + 7) % 7;
  } else if (daysFromLmp < 0) {
    trimester = "Not yet started";
    gestationalWeeks = 0;
    gestationalDays = 0;
  } else {
    gestationalWeeks = Math.floor(daysFromLmp / 7);
    gestationalDays = daysFromLmp % 7;
    if (gestationalWeeks < 14) trimester = "Trimester 1";
    else if (gestationalWeeks < 28) trimester = "Trimester 2";
    else trimester = "Trimester 3";
  }

  return {
    ok: true,
    result: {
      dueDate,
      conceptionEstimate,
      lmpEstimate,
      gestationalWeeks,
      gestationalDays,
      trimester,
      isPastDue,
      daysPastDue,
      weeksPastDue,
      daysRemaining,
      methodLabel: methodLabel(inputs.method),
    },
  };
}

function TimelineBar({ result }: { result: DueDateResult }) {
  const total = 280;
  const elapsed = Math.min(
    total,
    Math.max(0, result.gestationalWeeks * 7 + result.gestationalDays),
  );
  const pct = result.isPastDue ? 100 : (elapsed / total) * 100;

  return (
    <div className="space-y-2">
      <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="niche-fill h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-lime-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <span aria-hidden="true" className="absolute inset-y-0 left-[35%] w-px bg-white/80" />
        <span aria-hidden="true" className="absolute inset-y-0 left-[70%] w-px bg-white/80" />
      </div>
      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
        <span>LMP</span>
        <span>T1 · 14w</span>
        <span>T2 · 28w</span>
        <span>Due · 40w</span>
      </div>
    </div>
  );
}

export default function DueDateCalculator() {
  const today = useToday();
  const [inputs, setInputs] = useState<DueDateInputs>(EMPTY_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DueDateResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<DueDateInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
    if (patch.ivfEmbryo === "") setResult(null);
  };
  const dates = {
    lmp: inputs.lmp || today,
    conception: inputs.conception || today,
    ultrasoundDate: inputs.ultrasoundDate || today,
    ivfDate: inputs.ivfDate || today,
  };

  const calculate = () => {
    const built = buildResult({ ...inputs, ...dates });
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
    setInputs(EMPTY_INPUTS);
    setError("");
    setResult(null);
  };

  return (
    <CalcLayout>
      <CalcForm>
        <CalcHeader
          icon={CalendarHeart}
          niche="pregnancy"
          eyebrow="Due date"
          title="Pregnancy timeline"
          description="Estimate your due date, gestational age, and trimester."
        />

        <SegmentedControl
          label="Calculation method"
          options={[
            { value: "lmp", label: "LMP" },
            { value: "conception", label: "Conception" },
            { value: "ultrasound", label: "Ultrasound" },
            { value: "ivf", label: "IVF" },
          ]}
          value={inputs.method}
          onChange={(method) => update({ method })}
        />

        <InputGroup step={1} title="Key dates" columns={inputs.method === "lmp" || inputs.method === "conception" ? 1 : 2}>
          {inputs.method === "lmp" ? (
            <FieldShell label="First day of last menstrual period">
              <DatePicker value={dates.lmp} onChange={(lmp) => update({ lmp })} />
            </FieldShell>
          ) : null}

          {inputs.method === "conception" ? (
            <FieldShell label="Conception date">
              <DatePicker value={dates.conception} onChange={(conception) => update({ conception })} />
            </FieldShell>
          ) : null}

          {inputs.method === "ultrasound" ? (
            <>
              <FieldShell label="Ultrasound date">
                <DatePicker value={dates.ultrasoundDate} onChange={(ultrasoundDate) => update({ ultrasoundDate })} />
              </FieldShell>
              <FieldShell label="Gestational age at scan">
                <div className="grid grid-cols-2 gap-2">
                  <NumberStepper
                    value={inputs.ultrasoundWeeks}
                    min={0}
                    max={42}
                    step={1}
                    suffix="w"
                    placeholder={12}
                    onChange={(ultrasoundWeeks) => update({ ultrasoundWeeks })}
                  />
                  <NumberStepper
                    value={inputs.ultrasoundDays}
                    min={0}
                    max={6}
                    step={1}
                    suffix="d"
                    placeholder={0}
                    onChange={(ultrasoundDays) => update({ ultrasoundDays })}
                  />
                </div>
              </FieldShell>
            </>
          ) : null}

          {inputs.method === "ivf" ? (
            <>
              <FieldShell label="Embryo transfer date">
                <DatePicker value={dates.ivfDate} onChange={(ivfDate) => update({ ivfDate })} />
              </FieldShell>
              <FieldShell label="Embryo age at transfer">
                <CustomSelect
                  value={inputs.ivfEmbryo}
                  placeholder="Select embryo age"
                  onChange={(ivfEmbryo) => update({ ivfEmbryo: ivfEmbryo as IvfEmbryo })}
                  options={[
                    { value: "day3", label: "Day 3 embryo" },
                    { value: "day5", label: "Day 5 embryo" },
                  ]}
                />
              </FieldShell>
            </>
          ) : null}
        </InputGroup>

        <FormError message={error} />

        <ActionBar onCalculate={calculate} onClear={clear} />
      </CalcForm>

      <ResultCard resultRef={resultRef}>
        {!result ? (
          <EmptyResult
            label="Estimated due date"
            stats={["Gestational age", "Days remaining"]}
            rows={["Due date", "Conception date", "Last period", "Current trimester"]}
          />
        ) : (
          <ResultBody animationKey={animationKey}>
            <ResultHero
              label="Estimated due date"
              value={<span className="text-3xl sm:text-4xl">{formatDate(result.dueDate)}</span>}
              badge={result.trimester}
            >
              Based on {result.methodLabel}
            </ResultHero>

            {result.isPastDue ? (
              <ResultNote tone="warning">
                Past due by {result.daysPastDue} day{result.daysPastDue === 1 ? "" : "s"}
                {result.weeksPastDue > 0
                  ? ` (${result.weeksPastDue} week${result.weeksPastDue === 1 ? "" : "s"})`
                  : ""}
                . Only about 4% of births occur on the exact due date.
              </ResultNote>
            ) : (
              <StatGrid>
                <StatTile
                  tone="emerald"
                  label="Gestational age"
                  value={`${result.gestationalWeeks}w ${result.gestationalDays}d`}
                />
                <StatTile label="Days remaining" value={result.daysRemaining} />
              </StatGrid>
            )}

            <SectionTitle title={result.trimester} />
            <TimelineBar result={result} />

            <ResultTable
              caption="Pregnancy dates"
              align={["left", "right"]}
              rows={[
                { key: "due", selected: true, cells: ["Estimated due date", formatShort(result.dueDate)] },
                { key: "conception", cells: ["Estimated conception", formatShort(result.conceptionEstimate)] },
                { key: "lmp", cells: ["Estimated LMP", formatShort(result.lmpEstimate)] },
                {
                  key: "age",
                  cells: [
                    "Gestational age today",
                    result.isPastDue
                      ? "Past due"
                      : `${result.gestationalWeeks} weeks, ${result.gestationalDays} days`,
                  ],
                },
                { key: "trimester", cells: ["Trimester", result.trimester] },
              ]}
            />

            <ResultNote>
              Estimates only — not medical advice. Confirm dates with your clinician; most births occur within
              about two weeks of the estimated due date.
            </ResultNote>
          </ResultBody>
        )}
      </ResultCard>
    </CalcLayout>
  );
}
