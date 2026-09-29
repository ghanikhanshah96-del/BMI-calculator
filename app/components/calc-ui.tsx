"use client";

import { Eraser, Play, Sparkles, type LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode, Ref } from "react";

export function CalcLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
      {children}
    </div>
  );
}

export function CalcForm({ children }: { children: ReactNode }) {
  return <div className="min-w-0 space-y-5">{children}</div>;
}

export function CalcHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="icon-badge h-12 w-12 flex-none rounded-2xl">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
        <h3 className="text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

type SegmentOption<T extends string> = { value: T; label: string };

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  tone = "light",
  role = "group",
}: {
  options: ReadonlyArray<SegmentOption<NoInfer<T>>>;
  value: T;
  onChange: (value: NoInfer<T>) => void;
  label: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
  role?: "group" | "tablist";
}) {
  const isTabs = role === "tablist";
  return (
    <div
      role={role}
      aria-label={label}
      className={[
        "segmented flex w-full gap-1 overflow-x-auto rounded-2xl p-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:w-auto [&::-webkit-scrollbar]:hidden",
        tone === "dark" ? "bg-white/10" : "bg-linear-to-r from-slate-100 to-emerald-50/80 ring-1 ring-inset ring-slate-200",
      ].join(" ")}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role={isTabs ? "tab" : undefined}
            aria-selected={isTabs ? active : undefined}
            aria-pressed={isTabs ? undefined : active}
            onClick={() => onChange(option.value)}
            className={[
              "relative flex-1 whitespace-nowrap rounded-xl font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:flex-none",
              size === "sm" ? "min-h-9 px-3 text-xs" : "min-h-11 px-4 text-sm",
              active
                ? tone === "dark"
                  ? "bg-white text-emerald-800 shadow-md"
                  : "bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25"
                : tone === "dark"
                  ? "text-emerald-50 hover:bg-white/15"
                  : "text-slate-600 hover:bg-white hover:text-emerald-700 hover:shadow-md hover:shadow-emerald-900/10 hover:ring-1 hover:ring-emerald-300",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function InputGroup({
  step,
  title,
  hint,
  children,
  columns = 2,
}: {
  step: number;
  title: string;
  hint?: string;
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="mb-3 flex w-full items-center gap-2.5">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-xs font-semibold text-white shadow-md shadow-emerald-600/30">
          {step}
        </span>
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        {hint ? <span className="ml-auto text-xs text-slate-600">{hint}</span> : null}
      </legend>
      <div className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>{children}</div>
    </fieldset>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-100" role="alert">
      {message}
    </p>
  );
}

export function ActionBar({
  onCalculate,
  onClear,
  calculateLabel = "Calculate",
}: {
  onCalculate: () => void;
  onClear: () => void;
  calculateLabel?: string;
}) {
  return (
    <div className="flex gap-2 sm:gap-3">
      <button
        type="button"
        onClick={onCalculate}
        data-magnetic
        className="btn-gradient inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:flex-none sm:rounded-full"
      >
        <Play className="h-4 w-4 fill-current" aria-hidden="true" />
        {calculateLabel}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="btn-outline inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold sm:rounded-full"
      >
        <Eraser className="h-4 w-4" aria-hidden="true" />
        Clear
      </button>
    </div>
  );
}

export function ResultCard({
  children,
  resultRef,
  id,
  toolbar,
  bodyClassName = "",
}: {
  children: ReactNode;
  resultRef?: Ref<HTMLDivElement>;
  id?: string;
  toolbar?: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <div
      ref={resultRef}
      id={id}
      className="relative min-w-0 scroll-mt-24 rounded-3xl bg-linear-to-br from-emerald-50/80 via-white to-teal-50/70 p-1.5 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-100 lg:sticky lg:top-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 pb-2 pt-3">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          Your result
        </p>
        {toolbar}
      </div>
      <div className={`rounded-[1.25rem] bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}

export function EmptyResult({
  icon: Icon,
  text,
  formulas,
}: {
  icon: LucideIcon;
  text: ReactNode;
  formulas: string[];
}) {
  return (
    <div className="py-4 text-center sm:py-6">
      <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/50 [animation-duration:2.4s]" />
        <span className="icon-badge relative h-16 w-16 rounded-full">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </span>
      <p className="mt-4 text-lg font-semibold text-slate-900">No result yet</p>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-600">{text}</p>
      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {formulas.map((formula) => (
          <li
            key={formula}
            className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900 ring-1 ring-inset ring-emerald-100 transition hover:bg-linear-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:ring-transparent"
          >
            {formula}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultBody({ children, animationKey }: { children: ReactNode; animationKey: string | number }) {
  return (
    <div
      key={animationKey}
      className="space-y-4"
      style={{ animation: "bmiResultIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
    >
      {children}
    </div>
  );
}

export function ResultHero({
  label,
  value,
  unit,
  badge,
  children,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="spotlight spotlight-light relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 px-5 py-5 text-white shadow-lg shadow-emerald-700/25 sm:px-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(190,242,100,0.35),transparent_70%)]"
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50">{label}</p>
        {badge ? (
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/25">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        {value}
        {unit ? <span className="font-sans text-base font-medium text-emerald-50">{unit}</span> : null}
      </p>
      {children ? <div className="mt-2 text-sm leading-6 text-emerald-50">{children}</div> : null}
    </div>
  );
}

export function StatGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return (
    <div className={`grid gap-2.5 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>{children}</div>
  );
}

const statToneClass = {
  default: "from-white to-slate-50 text-slate-500",
  rose: "from-rose-50 to-white text-rose-700",
  emerald: "from-emerald-50 to-white text-emerald-700 ring-emerald-200",
  sky: "from-sky-50 to-white text-sky-700",
  amber: "from-amber-50 to-white text-amber-800",
} as const;

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
  center = false,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: keyof typeof statToneClass;
  center?: boolean;
}) {
  return (
    <div
      className={[
        "group rounded-xl bg-linear-to-br px-3 py-3 ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/10 hover:ring-emerald-300",
        statToneClass[tone],
        center ? "text-center" : "",
      ].join(" ")}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-slate-950 sm:text-xl">{value}</p>
      {hint ? <p className="text-xs text-slate-600">{hint}</p> : null}
    </div>
  );
}

export function SectionTitle({ title, hint }: { title: ReactNode; hint?: ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      {hint ? <p className="mt-0.5 text-xs leading-5 text-slate-600">{hint}</p> : null}
    </div>
  );
}

type TableRow = { key: string; cells: ReactNode[]; selected?: boolean };

export function ResultTable({
  head,
  rows,
  align,
  minWidth,
  caption,
}: {
  head?: ReactNode[];
  rows: TableRow[];
  align?: Array<"left" | "right">;
  minWidth?: number;
  caption?: string;
}) {
  const alignClass = (index: number) => (align?.[index] === "right" ? "text-right" : "text-left");
  const style: CSSProperties | undefined = minWidth ? { minWidth } : undefined;
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200/80">
      <table className="w-full text-sm" style={style}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {head ? (
          <thead>
            <tr className="bg-linear-to-r from-emerald-50 to-teal-50 text-xs uppercase tracking-wide text-emerald-900">
              {head.map((cell, index) => (
                <th key={index} scope="col" className={`px-3 py-2.5 font-semibold ${alignClass(index)}`}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key}
              className={
                row.selected
                  ? "bg-linear-to-r from-emerald-500 to-teal-500 font-semibold text-white"
                  : "text-slate-700 transition-colors even:bg-slate-50/80 hover:bg-emerald-50/80"
              }
            >
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className={`px-3 py-2.5 ${alignClass(index)} ${index > 0 ? "whitespace-nowrap" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ResultNote({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "warning" | "info";
}) {
  const toneClass = {
    muted: "text-slate-600",
    warning: "rounded-xl bg-amber-50 px-3.5 py-2.5 text-amber-900 ring-1 ring-inset ring-amber-100",
    info: "rounded-xl bg-emerald-50 px-3.5 py-2.5 text-emerald-900 ring-1 ring-inset ring-emerald-100",
  }[tone];
  return <p className={`text-xs leading-5 ${toneClass}`}>{children}</p>;
}
