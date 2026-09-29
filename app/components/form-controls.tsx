"use client";

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const FieldContext = createContext<{ label: string; labelId: string } | null>(null);

export function FieldShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const labelId = useId();
  return (
    <FieldContext.Provider value={{ label, labelId }}>
      <div className="field-shell block min-w-0 rounded-2xl px-3.5 py-3 text-sm text-slate-600 sm:px-4">
        <span
          id={labelId}
          className="field-label mb-2 block text-xs font-semibold uppercase tracking-[0.08em]"
        >
          {label}
        </span>
        {children}
      </div>
    </FieldContext.Provider>
  );
}

const triggerClass =
  "field-input group flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3.5 text-left text-base font-semibold text-slate-950 outline-none sm:text-lg";

const popupClass =
  "absolute left-0 z-40 mt-2 rounded-2xl bg-white p-1.5 shadow-2xl shadow-emerald-900/25 ring-1 ring-emerald-200";

const activeOptionClass =
  "bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/25";

const iconTileClass = "flex h-8 w-8 flex-none items-center justify-center rounded-lg transition-all duration-300";

const iconTileIdleClass =
  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-emerald-600/30 group-hover:ring-emerald-600";

const iconTileOpenClass =
  "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-600";

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
  const field = useContext(FieldContext);
  const fieldLabel = field
    ? suffix && !field.label.includes(`(${suffix})`)
      ? `${field.label} (${suffix})`
      : field.label
    : null;
  const [draft, setDraft] = useState<string | null>(null);
  const focused = draft !== null;
  const display = focused ? draft : Number.isFinite(value) ? String(value) : "";

  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const commitDraft = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    if (cleaned === "" || cleaned === ".") {
      onChange(min);
      setDraft(null);
      return;
    }
    const parsed = Number(cleaned);
    if (Number.isNaN(parsed)) {
      setDraft(null);
      return;
    }
    onChange(clamp(parsed));
    setDraft(null);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={fieldLabel ? `Decrease ${fieldLabel}` : "Decrease"}
        className="step-btn flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        onClick={() => onChange(clamp(Number((value - step).toFixed(4))))}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="field-input flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl px-3">
        <input
          type="text"
          inputMode="decimal"
          value={display}
          aria-label={fieldLabel ?? "Enter a number"}
          onFocus={(e) => {
            setDraft(Number.isFinite(value) ? String(value) : "");
            const input = e.currentTarget;
            requestAnimationFrame(() => input.select());
          }}
          onBlur={() => commitDraft(draft ?? "")}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
            setDraft(raw);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className={`w-full min-w-0 bg-transparent text-base font-semibold caret-emerald-700 outline-none placeholder:text-slate-400 sm:text-lg ${focused ? "text-emerald-900" : "text-slate-950"}`}
          placeholder="Type a value"
        />
        {suffix ? (
          <span className="shrink-0 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            {suffix}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={fieldLabel ? `Increase ${fieldLabel}` : "Increase"}
        className="step-btn flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        onClick={() => onChange(clamp(Number((value + step).toFixed(4))))}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
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
  const field = useContext(FieldContext);
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
        aria-labelledby={field ? `${field.labelId} ${listId}-value` : undefined}
        onClick={() => setOpen((prev) => !prev)}
        className={triggerClass}
      >
        <span id={`${listId}-value`} className="truncate">
          {selected?.label}
        </span>
        <span className={`${iconTileClass} ${open ? `rotate-180 ${iconTileOpenClass}` : iconTileIdleClass}`}>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          className={`${popupClass} max-h-64 w-full overflow-auto`}
          style={{ animation: "bmiResultIn 0.2s ease-out" }}
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
                    "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-sm font-semibold transition duration-200",
                    isActive
                      ? activeOptionClass
                      : "menu-option",
                  ].join(" ")}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  {isActive ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : null}
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
  const field = useContext(FieldContext);
  const selected = parseIsoDate(value);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );
  const rootRef = useRef<HTMLDivElement>(null);

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

  const toggleOpen = () => {
    if (!open) {
      const next = parseIsoDate(value);
      setView(new Date(next.getFullYear(), next.getMonth(), 1));
    }
    setOpen(!open);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={field ? `${field.label}: ${formatDisplayDate(value)}` : undefined}
        className={triggerClass}
      >
        <span className="truncate">{formatDisplayDate(value)}</span>
        <span className={`${iconTileClass} ${open ? iconTileOpenClass : iconTileIdleClass}`}>
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className={`${popupClass} w-full p-3 sm:w-80`}
          style={{ animation: "bmiResultIn 0.2s ease-out" }}
        >
          <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 p-1">
            <button
              type="button"
              aria-label="Previous month"
              className="step-btn flex h-10 w-10 items-center justify-center rounded-lg"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold text-emerald-950">{monthLabel}</p>
            <button
              type="button"
              aria-label="Next month"
              className="step-btn flex h-10 w-10 items-center justify-center rounded-lg"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
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
                    "flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition duration-200",
                    !inMonth
                      ? "cursor-default text-slate-300"
                      : isSelected
                        ? activeOptionClass
                        : "menu-option",
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
