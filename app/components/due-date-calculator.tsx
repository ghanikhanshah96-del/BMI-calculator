"use client";

import { CalendarHeart, Eraser, Play } from "lucide-react";
import { useRef, useState } from "react";
import { CustomSelect, DatePicker, FieldShell, NumberStepper } from "./form-controls";

type MethodId = "lmp" | "conception" | "ultrasound" | "ivf";
type IvfEmbryo = "day3" | "day5";

type DueDateInputs = {
  method: MethodId;
  lmp: string;
  conception: string;
  ultrasoundDate: string;
  ultrasoundWeeks: number;
  ultrasoundDays: number;
  ivfDate: string;
  ivfEmbryo: IvfEmbryo;
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

const DEFAULT_INPUTS: DueDateInputs = {
  method: "lmp",
  lmp: "2026-01-10",
  conception: "2026-01-24",
  ultrasoundDate: "2026-03-15",
  ultrasoundWeeks: 12,
  ultrasoundDays: 0,
  ivfDate: "2026-02-01",
  ivfEmbryo: "day5",
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
    const gaDays = inputs.ultrasoundWeeks * 7 + inputs.ultrasoundDays;
    if (gaDays < 0 || gaDays > 300) {
      return { ok: false, error: "Gestational age at scan looks invalid." };
    }
    dueDate = addDays(scan, 280 - gaDays);
    lmpEstimate = addDays(dueDate, -280);
    conceptionEstimate = addDays(lmpEstimate, 14);
  } else {
    const transfer = parseLocalDate(inputs.ivfDate);
    if (!transfer) return { ok: false, error: "Enter a valid IVF transfer date." };
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
          className="h-full rounded-full bg-emerald-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
        <span>LMP</span>
        <span>T1 · 14w</span>
        <span>T2 · 28w</span>
        <span>Due · 40w</span>
      </div>
    </div>
  );
}

export default function DueDateCalculator() {
  const [inputs, setInputs] = useState<DueDateInputs>(DEFAULT_INPUTS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DueDateResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const built = buildResult(inputs);
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
    setError("");
    setResult(null);
  };

  const methodTab = (id: MethodId, label: string) => (
    <button
      key={id}
      type="button"
      className={[
        "rounded-lg px-3 py-2 text-sm font-semibold transition",
        inputs.method === id
          ? "bg-emerald-700 text-white"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-emerald-50",
      ].join(" ")}
      onClick={() => setInputs({ ...inputs, method: id })}
    >
      {label}
    </button>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <CalendarHeart className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Due date</p>
            <h3 className="text-xl font-black text-slate-950 sm:text-2xl">Pregnancy timeline</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {methodTab("lmp", "LMP")}
          {methodTab("conception", "Conception")}
          {methodTab("ultrasound", "Ultrasound")}
          {methodTab("ivf", "IVF")}
        </div>

        <div className="space-y-3">
          {inputs.method === "lmp" ? (
            <FieldShell label="First day of last menstrual period">
              <DatePicker
                value={inputs.lmp}
                onChange={(lmp) => setInputs({ ...inputs, lmp })}
              />
            </FieldShell>
          ) : null}

          {inputs.method === "conception" ? (
            <FieldShell label="Conception date">
              <DatePicker
                value={inputs.conception}
                onChange={(conception) => setInputs({ ...inputs, conception })}
              />
            </FieldShell>
          ) : null}

          {inputs.method === "ultrasound" ? (
            <>
              <FieldShell label="Ultrasound date">
                <DatePicker
                  value={inputs.ultrasoundDate}
                  onChange={(ultrasoundDate) => setInputs({ ...inputs, ultrasoundDate })}
                />
              </FieldShell>
              <div className="grid gap-3 sm:grid-cols-2">
                <FieldShell label="Gestational weeks at scan">
                  <NumberStepper
                    value={inputs.ultrasoundWeeks}
                    min={0}
                    max={42}
                    step={1}
                    suffix="w"
                    onChange={(ultrasoundWeeks) => setInputs({ ...inputs, ultrasoundWeeks })}
                  />
                </FieldShell>
                <FieldShell label="Extra days">
                  <NumberStepper
                    value={inputs.ultrasoundDays}
                    min={0}
                    max={6}
                    step={1}
                    suffix="d"
                    onChange={(ultrasoundDays) => setInputs({ ...inputs, ultrasoundDays })}
                  />
                </FieldShell>
              </div>
            </>
          ) : null}

          {inputs.method === "ivf" ? (
            <>
              <FieldShell label="Embryo transfer date">
                <DatePicker
                  value={inputs.ivfDate}
                  onChange={(ivfDate) => setInputs({ ...inputs, ivfDate })}
                />
              </FieldShell>
              <FieldShell label="Embryo age at transfer">
                <CustomSelect
                  value={inputs.ivfEmbryo}
                  onChange={(ivfEmbryo) =>
                    setInputs({ ...inputs, ivfEmbryo: ivfEmbryo as IvfEmbryo })
                  }
                  options={[
                    { value: "day3", label: "Day 3 embryo" },
                    { value: "day5", label: "Day 5 embryo" },
                  ]}
                />
              </FieldShell>
            </>
          ) : null}
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
                Choose a method, enter the date details, then press <strong>Calculate</strong> for an
                estimated due date, gestational age, and trimester timeline.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>LMP: due date = LMP + 280 days</li>
                <li>Conception: due date = conception + 266 days</li>
                <li>Ultrasound / IVF: adjusted from scan or transfer date</li>
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
                  Estimated due date
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {formatDate(result.dueDate)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Based on {result.methodLabel}</p>
              </div>

              {result.isPastDue ? (
                <div className="rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-900">
                  Past due by {result.daysPastDue} day{result.daysPastDue === 1 ? "" : "s"}
                  {result.weeksPastDue > 0
                    ? ` (${result.weeksPastDue} week${result.weeksPastDue === 1 ? "" : "s"})`
                    : ""}
                  . Only about 4% of births occur on the exact due date.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Gestational age
                    </p>
                    <p className="text-xl font-black text-slate-950">
                      {result.gestationalWeeks}w {result.gestationalDays}d
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Days remaining
                    </p>
                    <p className="text-xl font-black text-slate-950">{result.daysRemaining}</p>
                  </div>
                </div>
              )}

              <p className="text-sm font-semibold text-slate-800">{result.trimester}</p>
              <TimelineBar result={result} />

              <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {(
                      [
                        ["Estimated due date", formatShort(result.dueDate)],
                        ["Estimated conception", formatShort(result.conceptionEstimate)],
                        ["Estimated LMP", formatShort(result.lmpEstimate)],
                        [
                          "Gestational age today",
                          result.isPastDue
                            ? "Past due"
                            : `${result.gestationalWeeks} weeks, ${result.gestationalDays} days`,
                        ],
                        ["Trimester", result.trimester],
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
                Estimates only — not medical advice. Confirm dates with your clinician; most births
                occur within about two weeks of the estimated due date.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
