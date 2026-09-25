"use client";

import { Eraser, Play, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { CustomSelect, DatePicker, FieldShell } from "./form-controls";

type CycleRow = {
  periodStart: Date;
  ovulationStart: Date;
  ovulationEnd: Date;
  ovulationPeak: Date;
  fertileStart: Date;
  fertileEnd: Date;
  pregnancyTest: Date;
  nextPeriod: Date;
  dueDate: Date;
};

type OvulationResult = {
  current: CycleRow;
  cycles: CycleRow[];
};

const MS_DAY = 24 * 60 * 60 * 1000;

const CYCLE_OPTIONS = Array.from({ length: 23 }, (_, i) => {
  const days = 22 + i;
  return { value: String(days), label: `${days} days` };
});

const DEFAULT_LMP = "2026-03-01";
const DEFAULT_CYCLE = 28;

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

function formatShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatRange(start: Date, end: Date) {
  return `${formatShort(start)} – ${formatShort(end)}`;
}

function buildCycle(periodStart: Date, cycleLength: number): CycleRow {
  const ovulationPeak = addDays(periodStart, cycleLength - 14);
  const ovulationStart = addDays(ovulationPeak, -2);
  const ovulationEnd = addDays(ovulationPeak, 2);
  const fertileStart = addDays(ovulationPeak, -5);
  const fertileEnd = addDays(ovulationPeak, 1);
  const pregnancyTest = addDays(ovulationPeak, 10);
  const nextPeriod = addDays(periodStart, cycleLength);
  const dueDate = addDays(periodStart, 280);

  return {
    periodStart,
    ovulationStart,
    ovulationEnd,
    ovulationPeak,
    fertileStart,
    fertileEnd,
    pregnancyTest,
    nextPeriod,
    dueDate,
  };
}

function buildResult(
  lmpIso: string,
  cycleLength: number,
): { ok: true; result: OvulationResult } | { ok: false; error: string } {
  const lmp = parseLocalDate(lmpIso);
  if (!lmp) return { ok: false, error: "Enter a valid first day of your last period." };
  if (cycleLength < 22 || cycleLength > 44) {
    return { ok: false, error: "Cycle length must be between 22 and 44 days." };
  }

  const cycles: CycleRow[] = [];
  let periodStart = lmp;
  for (let i = 0; i < 6; i += 1) {
    const row = buildCycle(periodStart, cycleLength);
    cycles.push(row);
    periodStart = row.nextPeriod;
  }

  return { ok: true, result: { current: cycles[0], cycles } };
}

export default function OvulationCalculator() {
  const [lmp, setLmp] = useState(DEFAULT_LMP);
  const [cycleLength, setCycleLength] = useState(DEFAULT_CYCLE);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OvulationResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [resultTab, setResultTab] = useState<"dates" | "cycles">("dates");
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const built = buildResult(lmp, cycleLength);
    if (built.ok === false) {
      setError(built.error);
      setResult(null);
      return;
    }
    setError("");
    setResult(built.result);
    setResultTab("dates");
    setAnimationKey((k) => k + 1);
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const clear = () => {
    setLmp(DEFAULT_LMP);
    setCycleLength(DEFAULT_CYCLE);
    setError("");
    setResult(null);
    setResultTab("dates");
  };

  const chipClass = (active: boolean) =>
    [
      "shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3",
      active ? "bg-white text-emerald-800 shadow-sm" : "text-emerald-50/90 hover:bg-white/10",
    ].join(" ");

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Ovulation</p>
            <h3 className="text-xl font-black text-slate-950 sm:text-2xl">Fertile window</h3>
          </div>
        </div>

        <div className="space-y-3">
          <FieldShell label="First day of your last period">
            <DatePicker value={lmp} onChange={setLmp} />
          </FieldShell>
          <FieldShell label="Average length of cycles">
            <CustomSelect
              value={String(cycleLength)}
              onChange={(value) => setCycleLength(Number(value))}
              options={CYCLE_OPTIONS}
            />
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

        <p className="text-xs leading-5 text-slate-500">
          This tool estimates fertile days from cycle tracking. It should not be used as birth control.
        </p>
      </div>

      <div
        ref={resultRef}
        className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        <div className="shrink-0 bg-emerald-700 px-3 py-3 sm:px-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">Result</p>
            {result ? (
              <div className="flex gap-1" role="tablist" aria-label="Result sections">
                <button
                  type="button"
                  role="tab"
                  aria-selected={resultTab === "dates"}
                  className={chipClass(resultTab === "dates")}
                  onClick={() => setResultTab("dates")}
                >
                  This cycle
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={resultTab === "cycles"}
                  className={chipClass(resultTab === "cycles")}
                  onClick={() => setResultTab("cycles")}
                >
                  Next 6 cycles
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:max-h-[min(68vh,640px)]">
          {!result ? (
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p className="text-lg font-semibold text-slate-900">No result yet</p>
              <p>
                Enter the first day of your last period and average cycle length, then press{" "}
                <strong>Calculate</strong> for ovulation, fertile window, test day, and the next six
                cycles.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Ovulation ≈ cycle day (length − 14)</li>
                <li>Fertile window ≈ ovulation − 5 through +1 day</li>
                <li>Due date if pregnant ≈ LMP + 280 days</li>
              </ul>
            </div>
          ) : (
            <div
              key={`${animationKey}-${resultTab}`}
              className="space-y-4"
              style={{ animation: "bmiResultIn 0.28s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
            >
              {resultTab === "dates" ? (
                <>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-5 ring-1 ring-emerald-100">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                      Most probable ovulation
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                      {formatShort(result.current.ovulationPeak)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Window {formatRange(result.current.ovulationStart, result.current.ovulationEnd)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["Fertile", formatRange(result.current.fertileStart, result.current.fertileEnd), "bg-emerald-50 text-emerald-900"],
                        ["Test day", formatShort(result.current.pregnancyTest), "bg-sky-50 text-sky-900"],
                        ["Next period", formatShort(result.current.nextPeriod), "bg-amber-50 text-amber-900"],
                      ] as const
                    ).map(([label, value, tone]) => (
                      <div key={label} className={`rounded-lg px-3 py-2 text-xs ${tone}`}>
                        <p className="font-semibold uppercase tracking-wide opacity-80">{label}</p>
                        <p className="mt-0.5 text-sm font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200">
                    <table className="w-full min-w-[280px] text-left text-sm">
                      <tbody>
                        {(
                          [
                            [
                              "Ovulation window",
                              formatRange(result.current.ovulationStart, result.current.ovulationEnd),
                            ],
                            ["Most probable ovulation date", formatShort(result.current.ovulationPeak)],
                            [
                              "Intercourse window for pregnancy",
                              formatRange(result.current.fertileStart, result.current.fertileEnd),
                            ],
                            ["Pregnancy test", formatShort(result.current.pregnancyTest)],
                            ["Next period start", formatShort(result.current.nextPeriod)],
                            ["Due date if pregnant", formatShort(result.current.dueDate)],
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
                </>
              ) : (
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Important dates for the next 6 cycles</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Assumes a steady {cycleLength}-day cycle starting from your LMP.
                  </p>
                  <div className="mt-3 overflow-x-auto rounded-lg ring-1 ring-slate-200">
                    <table className="w-full min-w-[420px] text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                          <th className="px-3 py-2 font-semibold">Period start</th>
                          <th className="px-3 py-2 font-semibold">Ovulation window</th>
                          <th className="px-3 py-2 font-semibold">Due date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.cycles.map((row) => (
                          <tr key={row.periodStart.toISOString()} className="border-t border-slate-100 text-slate-700">
                            <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-slate-900">
                              {formatShort(row.periodStart)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5">
                              {formatRange(row.ovulationStart, row.ovulationEnd)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5">
                              {formatShort(row.dueDate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <p className="border-t border-slate-100 pt-3 text-[11px] leading-4 text-slate-400">
                Estimates only — not contraception or medical advice. Irregular cycles and hormone
                testing can change timing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
