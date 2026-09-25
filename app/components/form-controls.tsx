"use client";

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export function FieldShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      <span className="mb-2 block font-medium text-slate-700">{label}</span>
      {children}
    </div>
  );
}

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  suffix,
}: NumberStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 transition hover:bg-emerald-100"
        onClick={() => onChange(clamp(Number((value - step).toFixed(4))))}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="flex min-w-0 flex-1 items-baseline gap-1">
        <input
          type="text"
          inputMode="decimal"
          value={Number.isFinite(value) ? String(value) : ""}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d.]/g, "");
            if (raw === "" || raw === ".") {
              onChange(min);
              return;
            }
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) onChange(clamp(parsed));
          }}
          className="w-full bg-transparent text-lg font-semibold text-slate-950 outline-none"
        />
        {suffix ? <span className="text-sm font-medium text-slate-500">{suffix}</span> : null}
      </div>
      <button
        type="button"
        aria-label="Increase"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 transition hover:bg-emerald-100"
        onClick={() => onChange(clamp(Number((value + step).toFixed(4))))}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

type SelectOption = { value: string; label: string };

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
};

export function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-lg font-semibold text-slate-950 transition hover:border-emerald-300 hover:bg-emerald-50/60"
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-emerald-700 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-emerald-100 bg-white p-1 shadow-lg shadow-emerald-900/10"
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={[
                    "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-semibold transition",
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "text-slate-800 hover:bg-emerald-50 hover:text-emerald-900",
                  ].join(" ")}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  {isActive ? <Check className="h-4 w-4" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}

function formatDisplayDate(value: string) {
  const date = parseIsoDate(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);
  const [view, setView] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const days = useMemo(() => {
    const firstDay = new Date(view.getFullYear(), view.getMonth(), 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells: Array<{ date: Date; inMonth: boolean }> = [];

    for (let i = 0; i < startWeekday; i += 1) {
      const date = new Date(view.getFullYear(), view.getMonth(), i - startWeekday + 1);
      cells.push({ date, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: new Date(view.getFullYear(), view.getMonth(), day), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      cells.push({ date: next, inMonth: false });
    }
    return cells;
  }, [view]);

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(view);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-lg font-semibold text-slate-950 transition hover:border-emerald-300 hover:bg-emerald-50/60"
      >
        <span>{formatDisplayDate(value)}</span>
        <CalendarDays className="h-4 w-4 text-emerald-700" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-[min(100%,20rem)] rounded-xl border border-emerald-100 bg-white p-3 shadow-lg shadow-emerald-900/10">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 text-emerald-800 hover:bg-emerald-50"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-bold text-slate-900">{monthLabel}</p>
            <button
              type="button"
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 text-emerald-800 hover:bg-emerald-50"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, inMonth }) => {
              const iso = toIsoDate(date);
              const isSelected = iso === value;
              return (
                <button
                  key={iso + String(inMonth)}
                  type="button"
                  disabled={!inMonth}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={[
                    "flex h-9 items-center justify-center rounded-lg text-sm font-semibold transition",
                    !inMonth
                      ? "cursor-default text-slate-300"
                      : isSelected
                        ? "bg-emerald-700 text-white"
                        : "text-slate-800 hover:bg-emerald-50 hover:text-emerald-900",
                  ].join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
