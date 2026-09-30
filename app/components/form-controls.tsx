"use client";

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "./icons";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

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
      <div className="field-shell field-box">
        <span id={labelId} className="field-label field-caption">
          {label}
        </span>
        {children}
      </div>
    </FieldContext.Provider>
  );
}

const activeOptionClass =
  "bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/25";

const iconTileOpenClass =
  "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-600";

const VIEWPORT_MARGIN = 12;
const POPUP_GAP = 8;

/**
 * Positions a portal popup against its trigger with `position: fixed`, flipping above the
 * trigger when there is more room there, and following scroll/resize. Styles are written
 * directly to the element so repositioning never re-renders the list.
 */
function usePopupPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  popupRef: RefObject<HTMLElement | null>,
  { maxHeight = 320, matchWidth = true }: { maxHeight?: number; matchWidth?: boolean } = {},
) {
  useLayoutEffect(() => {
    if (!open) return;
    let frame = 0;
    const place = () => {
      const trigger = triggerRef.current;
      const popup = popupRef.current;
      if (!trigger || !popup) return;
      const rect = trigger.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      const usableWidth = viewportWidth - VIEWPORT_MARGIN * 2;

      if (matchWidth) popup.style.minWidth = `${Math.min(rect.width, usableWidth)}px`;
      popup.style.maxWidth = `${Math.min(384, usableWidth)}px`;
      popup.style.maxHeight = "";

      const naturalHeight = Math.min(popup.scrollHeight, maxHeight);
      const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_MARGIN - POPUP_GAP;
      const spaceAbove = rect.top - VIEWPORT_MARGIN - POPUP_GAP;
      const flip = spaceBelow < naturalHeight && spaceAbove > spaceBelow;
      const available = Math.max(140, flip ? spaceAbove : spaceBelow);
      popup.style.maxHeight = `${Math.min(maxHeight, available)}px`;

      const height = popup.offsetHeight;
      const width = popup.offsetWidth;
      const top = flip ? rect.top - POPUP_GAP - height : rect.bottom + POPUP_GAP;
      const left = Math.min(Math.max(VIEWPORT_MARGIN, rect.left), viewportWidth - VIEWPORT_MARGIN - width);
      popup.style.top = `${Math.max(VIEWPORT_MARGIN, top)}px`;
      popup.style.left = `${Math.max(VIEWPORT_MARGIN, left)}px`;
      popup.style.transformOrigin = flip ? "bottom" : "top";
      popup.style.visibility = "visible";
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [open, triggerRef, popupRef, maxHeight, matchWidth]);
}

/** Closes a popup on outside pointer down or Escape. */
function useDismiss(
  open: boolean,
  close: (returnFocus: boolean) => void,
  refs: Array<RefObject<HTMLElement | null>>,
) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      close(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, refs]);
}

type NumberStepperProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  /** Typical value shown as "e.g. …" and used as the starting point when stepping from empty. */
  placeholder?: number;
  /** Replaces the unit chip, e.g. with a unit dropdown. */
  addon?: ReactNode;
};

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  suffix,
  placeholder,
  addon,
}: NumberStepperProps) {
  const field = useContext(FieldContext);
  const fieldLabel = field
    ? suffix && !field.label.includes(suffix)
      ? `${field.label} (${suffix})`
      : field.label
    : null;
  const [draft, setDraft] = useState<string | null>(null);
  const hold = useRef<{ timeout?: number; interval?: number }>({});
  const focused = draft !== null;
  const display = focused ? draft : value === null ? "" : String(value);

  const nextValue = (current: number | null, direction: 1 | -1) => {
    if (current === null) return Math.min(max, Math.max(min, placeholder ?? min));
    const next = Number((current + direction * step).toFixed(4));
    return Math.min(max, Math.max(min, next));
  };

  /* While the input is focused its text is the source of truth, so step from it and keep it in sync;
     otherwise blurring would commit the stale text over the stepped value. */
  const shownValue = () => {
    if (draft === null) return value;
    return draft === "" || draft === "." ? null : Number(draft);
  };

  const emit = (next: number) => {
    onChange(next);
    setDraft((current) => (current === null ? null : String(next)));
  };

  const stopHold = () => {
    window.clearTimeout(hold.current.timeout);
    window.clearInterval(hold.current.interval);
    hold.current = {};
  };

  useEffect(() => stopHold, []);

  const startHold = (direction: 1 | -1) => {
    stopHold();
    let current = nextValue(shownValue(), direction);
    emit(current);
    hold.current.timeout = window.setTimeout(() => {
      hold.current.interval = window.setInterval(() => {
        current = nextValue(current, direction);
        emit(current);
      }, 70);
    }, 420);
  };

  const commitDraft = (raw: string) => {
    setDraft(null);
    const cleaned = raw.replace(/[^\d.]/g, "");
    if (cleaned === "" || cleaned === ".") {
      onChange(null);
      return;
    }
    const parsed = Number(cleaned);
    if (!Number.isNaN(parsed)) onChange(parsed);
  };

  const arrow = (direction: 1 | -1) => {
    const verb = direction === 1 ? "Increase" : "Decrease";
    return (
      <button
        type="button"
        tabIndex={-1}
        aria-label={fieldLabel ? `${verb} ${fieldLabel}` : verb}
        className="num-arrow"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          startHold(direction);
        }}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        onClick={(event) => {
          if (event.detail === 0) emit(nextValue(shownValue(), direction));
        }}
      >
        {direction === 1 ? (
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    );
  };

  return (
    <div className="field-input num-field">
      <input
        type="text"
        inputMode="decimal"
        value={display}
        aria-label={fieldLabel ?? "Enter a number"}
        placeholder={placeholder !== undefined ? `e.g. ${placeholder}` : "Enter a value"}
        onFocus={(event) => {
          setDraft(value === null ? "" : String(value));
          const input = event.currentTarget;
          requestAnimationFrame(() => input.select());
        }}
        onBlur={() => commitDraft(draft ?? "")}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
          setDraft(raw);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            emit(nextValue(shownValue(), event.key === "ArrowUp" ? 1 : -1));
          }
        }}
        className={`num-input ${focused ? "text-emerald-900" : "text-slate-950"}`}
      />
      {addon ?? (suffix ? <span className="unit-chip">{suffix}</span> : null)}
      <span className="num-arrows">
        {arrow(1)}
        {arrow(-1)}
      </span>
    </div>
  );
}

type SelectOption = { value: string; label: string };

type CustomSelectProps = {
  /** "" means nothing is selected yet; the placeholder is shown. */
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  /** "unit" renders a compact pill trigger for use inside a number field. */
  variant?: "field" | "unit";
  ariaLabel?: string;
};

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  variant = "field",
  ariaLabel,
}: CustomSelectProps) {
  const field = useContext(FieldContext);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", timer: 0 });
  const listId = useId();
  const isUnit = variant === "unit";
  /* Every list leads with a "Select ..." entry; picking it clears the choice so no result is shown. */
  const listOptions = useMemo(
    () => [{ value: "", label: isUnit ? "Select unit" : placeholder }, ...options],
    [isUnit, options, placeholder],
  );
  const selected = options.find((option) => option.value === value) ?? null;
  const selectedIndex = listOptions.findIndex((option) => option.value === value);

  const refs = useMemo(() => [triggerRef, listRef], []);
  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  usePopupPosition(open, triggerRef, listRef, { maxHeight: 288 });
  useDismiss(open, close, refs);

  useLayoutEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openList = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = listOptions[index];
    if (!option) return;
    onChange(option.value);
    close(true);
  };

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const onListKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    const last = listOptions.length - 1;
    const keyMoves: Record<string, () => number> = {
      ArrowDown: () => Math.min(last, activeIndex + 1),
      ArrowUp: () => Math.max(0, activeIndex - 1),
      Home: () => 0,
      End: () => last,
      PageDown: () => Math.min(last, activeIndex + 5),
      PageUp: () => Math.max(0, activeIndex - 5),
    };
    if (keyMoves[event.key]) {
      event.preventDefault();
      setActiveIndex(keyMoves[event.key]());
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const state = typeahead.current;
      window.clearTimeout(state.timer);
      state.text += event.key.toLowerCase();
      state.timer = window.setTimeout(() => {
        state.text = "";
      }, 600);
      const match = listOptions.findIndex((option) => option.value && option.label.toLowerCase().startsWith(state.text));
      if (match >= 0) setActiveIndex(match);
    }
  };

  const labelledBy = ariaLabel ? undefined : field ? `${field.labelId} ${listId}-value` : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel ? `${ariaLabel}: ${selected?.label ?? placeholder}` : undefined}
        aria-labelledby={labelledBy}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onTriggerKeyDown}
        className={isUnit ? "group unit-select" : "field-input group select-trigger"}
      >
        <span id={`${listId}-value`} className={selected ? "" : isUnit ? "text-emerald-700/70" : "text-slate-400"}>
          {selected?.label ?? placeholder}
        </span>
        {isUnit ? (
          <ChevronDown className={`h-3.5 w-3.5 flex-none transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        ) : (
          <span className={`icon-tile ${open ? `rotate-180 ${iconTileOpenClass}` : "icon-tile-idle"}`}>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </button>
      {open
        ? createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              tabIndex={-1}
              aria-activedescendant={`${listId}-opt-${activeIndex}`}
              aria-label={ariaLabel ?? field?.label}
              onKeyDown={onListKeyDown}
              className="select-popup w-max"
            >
              {listOptions.map((option, index) => {
                const isPlaceholder = option.value === "";
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                const stateClass = isPlaceholder
                  ? `select-option-placeholder ${isActive ? "select-option-active" : ""}`
                  : isSelected
                    ? activeOptionClass
                    : isActive
                      ? "select-option-active"
                      : "";
                return (
                  <li
                    key={option.value || "placeholder"}
                    data-placeholder={isPlaceholder || undefined}
                    id={`${listId}-opt-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    onPointerEnter={() => setActiveIndex(index)}
                    onClick={() => choose(index)}
                    className={`select-option ${stateClass}`}
                  >
                    {option.label}
                    {isSelected && !isPlaceholder ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : null}
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </>
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
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseIsoDate(value));
}

const noopSubscribe = () => () => {};

/** Today's local date as YYYY-MM-DD; "" during server render so hydration never mismatches. */
export function useToday() {
  return useSyncExternalStore(noopSubscribe, () => toIsoDate(new Date()), () => "");
}

type DatePickerProps = {
  /** "" shows the placeholder. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function DatePicker({ value, onChange, placeholder = "Select a date" }: DatePickerProps) {
  const field = useContext(FieldContext);
  const today = useToday();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const start = value ? parseIsoDate(value) : new Date();
    return new Date(start.getFullYear(), start.getMonth(), 1);
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const refs = useMemo(() => [triggerRef, popupRef], []);
  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  usePopupPosition(open, triggerRef, popupRef, { maxHeight: 520, matchWidth: false });
  useDismiss(open, close, refs);

  const days = useMemo(() => {
    const firstDay = new Date(view.getFullYear(), view.getMonth(), 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells: Array<{ date: Date; inMonth: boolean }> = [];

    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ date: new Date(view.getFullYear(), view.getMonth(), i - startWeekday + 1), inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: new Date(view.getFullYear(), view.getMonth(), day), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const next = new Date(cells[cells.length - 1].date);
      next.setDate(next.getDate() + 1);
      cells.push({ date: next, inMonth: false });
    }
    return cells;
  }, [view]);

  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(view);
  const display = value ? formatDisplayDate(value) : "";

  const showMonthOf = (iso: string) => {
    const date = iso ? parseIsoDate(iso) : new Date();
    setView(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const toggleOpen = () => {
    if (!open) showMonthOf(value || today);
    setOpen(!open);
  };

  const pick = (iso: string) => {
    onChange(iso);
    close(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={field ? `${field.label}: ${display || placeholder}` : undefined}
        className="field-input group select-trigger"
      >
        <span className={display ? "" : "text-slate-400"}>{display || placeholder}</span>
        <span className={`icon-tile ${open ? iconTileOpenClass : "icon-tile-idle"}`}>
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>

      {open
        ? createPortal(
            <div ref={popupRef} role="dialog" aria-label="Choose a date" className="select-popup w-76 p-3">
              <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 p-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="step-btn flex h-9 w-9 items-center justify-center rounded-lg"
                  onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="text-sm font-semibold text-emerald-950">{monthLabel}</p>
                <button
                  type="button"
                  aria-label="Next month"
                  className="step-btn flex h-9 w-9 items-center justify-center rounded-lg"
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
                  const isToday = iso === today;
                  return (
                    <button
                      key={iso + String(inMonth)}
                      type="button"
                      disabled={!inMonth}
                      aria-label={`${formatDisplayDate(iso)}${isToday ? " (today)" : ""}`}
                      aria-pressed={isSelected}
                      onClick={() => pick(iso)}
                      className={[
                        "flex h-9 items-center justify-center rounded-xl text-sm font-semibold transition duration-200",
                        !inMonth
                          ? "cursor-default text-slate-300"
                          : isSelected
                            ? activeOptionClass
                            : isToday
                              ? "menu-option ring-2 ring-inset ring-emerald-400 text-emerald-800"
                              : "menu-option",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                <span className="text-xs text-slate-500">{today ? `Today: ${formatDisplayDate(today)}` : ""}</span>
                <button
                  type="button"
                  data-tip="Select today's date"
                  className="today-btn"
                  onClick={() => {
                    showMonthOf(today);
                    pick(today);
                  }}
                >
                  Today
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
