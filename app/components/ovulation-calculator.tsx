"use client";

import { Sparkles } from "./icons";
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
import { CustomSelect, DatePicker, FieldShell, useToday } from "./form-controls";
import { validateFields } from "../lib/validate";

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
  cycleChoice: string,
): { ok: true; result: OvulationResult } | { ok: false; error: string } {
  const lmp = parseLocalDate(lmpIso);
  if (!lmp) return { ok: false, error: "Enter a valid first day of your last period." };
  const error = validateFields([{ label: "average cycle length", value: cycleChoice, kind: "choice" }]);
  if (error) return { ok: false, error };
  const cycleLength = Number(cycleChoice);

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
  const today = useToday();
  const [lmpChoice, setLmp] = useState("");
  const [cycleChoice, setCycleChoice] = useState("");
  const [cycleLength, setCycleLength] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OvulationResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [resultTab, setResultTab] = useState<"dates" | "cycles">("dates");
  const resultRef = useRef<HTMLDivElement>(null);
  const lmp = lmpChoice || today;

  const calculate = () => {
    const built = buildResult(lmp, cycleChoice);
    if (built.ok) setCycleLength(Number(cycleChoice));
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
    setLmp("");
    setCycleChoice("");
    setError("");
    setResult(null);
    setResultTab("dates");
  };

  return (
    <CalcLayout>
      <CalcForm>
        <CalcHeader
          icon={Sparkles}
          niche="ovulation"
          eyebrow="Ovulation"
          title="Fertile window"
          description="Predict ovulation, your fertile days, and the next six cycles."
        />

        <InputGroup step={1} title="Your cycle">
          <FieldShell label="First day of your last period">
            <DatePicker value={lmp} onChange={setLmp} />
          </FieldShell>
          <FieldShell label="Average length of cycles">
            <CustomSelect
              value={cycleChoice}
              placeholder="Select cycle length"
              onChange={(value) => {
                setCycleChoice(value);
                if (!value) setResult(null);
              }}
              options={CYCLE_OPTIONS}
            />
          </FieldShell>
        </InputGroup>

        <FormError message={error} />

        <ActionBar onCalculate={calculate} onClear={clear} />

        <ResultNote tone="info">
          This tool estimates fertile days from cycle tracking. It should not be used as birth control.
        </ResultNote>
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
                { value: "dates", label: "This cycle" },
                { value: "cycles", label: "Next 6 cycles" },
              ]}
              value={resultTab}
              onChange={setResultTab}
            />
          ) : null
        }
      >
        {!result ? (
          <EmptyResult
            label="Most probable ovulation"
            stats={["Fertile", "Test day", "Next period"]}
            rows={["Fertile window", "Peak fertility", "Pregnancy test", "Next period", "Due date if conceived"]}
          />
        ) : (
          <ResultBody animationKey={`${animationKey}-${resultTab}`}>
            {resultTab === "dates" ? (
              <>
                <ResultHero
                  label="Most probable ovulation"
                  value={<span className="text-3xl sm:text-4xl">{formatShort(result.current.ovulationPeak)}</span>}
                  badge={`${cycleLength}-day cycle`}
                >
                  Window {formatRange(result.current.ovulationStart, result.current.ovulationEnd)}
                </ResultHero>

                <StatGrid columns={3}>
                  <StatTile
                    tone="emerald"
                    label="Fertile"
                    value={<span className="text-sm sm:text-base">{formatRange(result.current.fertileStart, result.current.fertileEnd)}</span>}
                  />
                  <StatTile
                    tone="sky"
                    label="Test day"
                    value={<span className="text-sm sm:text-base">{formatShort(result.current.pregnancyTest)}</span>}
                  />
                  <StatTile
                    tone="amber"
                    label="Next period"
                    value={<span className="text-sm sm:text-base">{formatShort(result.current.nextPeriod)}</span>}
                  />
                </StatGrid>

                <ResultTable
                  caption="Key dates for this cycle"
                  align={["left", "right"]}
                  rows={[
                    {
                      key: "window",
                      cells: ["Ovulation window", formatRange(result.current.ovulationStart, result.current.ovulationEnd)],
                    },
                    {
                      key: "peak",
                      selected: true,
                      cells: ["Most probable ovulation date", formatShort(result.current.ovulationPeak)],
                    },
                    {
                      key: "fertile",
                      cells: [
                        "Intercourse window for pregnancy",
                        formatRange(result.current.fertileStart, result.current.fertileEnd),
                      ],
                    },
                    { key: "test", cells: ["Pregnancy test", formatShort(result.current.pregnancyTest)] },
                    { key: "next", cells: ["Next period start", formatShort(result.current.nextPeriod)] },
                    { key: "due", cells: ["Due date if pregnant", formatShort(result.current.dueDate)] },
                  ]}
                />
              </>
            ) : (
              <>
                <SectionTitle
                  title="Important dates for the next 6 cycles"
                  hint={`Assumes a steady ${cycleLength}-day cycle starting from your LMP.`}
                />
                <ResultTable
                  caption="Next six cycles"
                  head={["Period start", "Ovulation window", "Due date"]}
                  minWidth={420}
                  rows={result.cycles.map((row) => ({
                    key: row.periodStart.toISOString(),
                    cells: [
                      <span key="p" className="whitespace-nowrap font-semibold text-slate-900">
                        {formatShort(row.periodStart)}
                      </span>,
                      formatRange(row.ovulationStart, row.ovulationEnd),
                      formatShort(row.dueDate),
                    ],
                  }))}
                />
              </>
            )}

            <ResultNote>
              Estimates only — not contraception or medical advice. Irregular cycles and hormone testing can
              change timing.
            </ResultNote>
          </ResultBody>
        )}
      </ResultCard>
    </CalcLayout>
  );
}
