import { useMemo, useRef } from "react";

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

/** Rounds half away from zero, nudged past binary float error (1.005 → 1.01). */
export function roundTo(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Whole feet plus inches to one decimal, carrying 12 in into the next foot. */
export function feetInchesFromCm(cm: number) {
  const totalInches = roundTo(cm / CM_PER_IN, 1);
  const feet = Math.floor(totalInches / 12);
  return { feet, inches: roundTo(totalInches - feet * 12, 1) };
}

export function cmFromFeetInches(feet: number | null, inches: number | null) {
  if (feet === null) return null;
  return (feet * 12 + (inches ?? 0)) * CM_PER_IN;
}

export const formatCm = (cm: number) => `${roundTo(cm, 1)} cm`;
export const formatKg = (kg: number) => `${roundTo(kg, 1)} kg`;
export const formatIn = (cm: number) => `${roundTo(cm / CM_PER_IN, 1)} in`;
export const formatLb = (kg: number) => `${roundTo(kg / KG_PER_LB, 1)} lb`;
export const formatFeetInches = (cm: number) => {
  const { feet, inches } = feetInchesFromCm(cm);
  return `${feet} ft ${inches} in`;
};

/** Absorbs display rounding (0.1 in ≈ 0.25 cm) so a value converted from a valid entry is never rejected. */
const RANGE_SLACK = 0.2;

/** Checks an exact metric value against a metric range and words the message in the user's units. */
export function checkRange(
  label: string,
  value: number,
  [min, max]: readonly [number, number],
  format: (metric: number) => string,
) {
  if (value >= min - RANGE_SLACK && value <= max + RANGE_SLACK) return "";
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} must be between ${format(min)} and ${format(max)}.`;
}

/** One measured quantity (height, weight, ...) and the input fields that hold it in each unit mode. */
export type Quantity<I, M extends string> = {
  key: string;
  fields: (mode: M) => ReadonlyArray<keyof I>;
  /** Exact metric value from the fields of `mode`, or null while they are empty. */
  toMetric: (inputs: I, mode: M) => number | null;
  /** Rounded display values for `mode`. */
  fromMetric: (metric: number | null, mode: M, inputs: I) => Partial<I>;
};

type NumberField<I> = { [K in keyof I]: I[K] extends number | null ? K : never }[keyof I];

const num = <I>(inputs: I, field: NumberField<I>) => inputs[field] as number | null;

/** Height in cm, or feet + inches in the imperial mode. */
export function heightQuantity<I, M extends string>(
  imperial: M,
  cm: NumberField<I>,
  feet: NumberField<I>,
  inches: NumberField<I>,
): Quantity<I, M> {
  return {
    key: "height",
    fields: (mode) => (mode === imperial ? [feet, inches] : [cm]),
    toMetric: (inputs, mode) => (mode === imperial ? cmFromFeetInches(num(inputs, feet), num(inputs, inches)) : num(inputs, cm)),
    fromMetric: (value, mode) => {
      if (mode !== imperial) return { [cm]: value === null ? null : roundTo(value, 1) } as Partial<I>;
      if (value === null) return { [feet]: null, [inches]: null } as Partial<I>;
      const split = feetInchesFromCm(value);
      return { [feet]: split.feet, [inches]: split.inches } as Partial<I>;
    },
  };
}

/** A tape measurement in cm, or inches in the imperial mode. */
export function lengthQuantity<I, M extends string>(key: string, imperial: M, cm: NumberField<I>, inches: NumberField<I>): Quantity<I, M> {
  return {
    key,
    fields: (mode) => [mode === imperial ? inches : cm],
    toMetric: (inputs, mode) => {
      if (mode !== imperial) return num(inputs, cm);
      const value = num(inputs, inches);
      return value === null ? null : value * CM_PER_IN;
    },
    fromMetric: (value, mode) =>
      (mode === imperial
        ? { [inches]: value === null ? null : roundTo(value / CM_PER_IN, 1) }
        : { [cm]: value === null ? null : roundTo(value, 1) }) as Partial<I>,
  };
}

/** Body weight in kg, or pounds in the imperial mode. */
export function weightQuantity<I, M extends string>(imperial: M, kg: NumberField<I>, lb: NumberField<I>): Quantity<I, M> {
  return {
    key: "weight",
    fields: (mode) => [mode === imperial ? lb : kg],
    toMetric: (inputs, mode) => {
      if (mode !== imperial) return num(inputs, kg);
      const value = num(inputs, lb);
      return value === null ? null : value * KG_PER_LB;
    },
    fromMetric: (value, mode) =>
      (mode === imperial
        ? { [lb]: value === null ? null : roundTo(value / KG_PER_LB, 1) }
        : { [kg]: value === null ? null : roundTo(value, 1) }) as Partial<I>,
  };
}

type Memory<I, M> = {
  mode: M;
  shown: string;
  exact: number | null;
  origin: { mode: M; values: Partial<I> };
};

/**
 * Converts inputs between unit modes without drift. Each converted quantity remembers its exact
 * metric value and the entry it came from; while the fields are untouched, results use the exact
 * value and switching back restores the original entry, so changing units never changes a result.
 */
export function useUnitConversion<I extends object, M extends string>(quantities: ReadonlyArray<Quantity<I, M>>) {
  const memory = useRef(new Map<string, Memory<I, M>>());

  return useMemo(() => {
    const pick = (inputs: I, quantity: Quantity<I, M>, mode: M) =>
      Object.fromEntries(quantity.fields(mode).map((field) => [field, inputs[field]])) as Partial<I>;
    const snapshot = (inputs: I, quantity: Quantity<I, M>, mode: M) => JSON.stringify(pick(inputs, quantity, mode));
    const untouched = (inputs: I, quantity: Quantity<I, M>, mode: M) => {
      const saved = memory.current.get(quantity.key);
      return saved && saved.mode === mode && saved.shown === snapshot(inputs, quantity, mode) ? saved : null;
    };

    /** Exact metric values for the fields currently shown, keyed by quantity. */
    const metric = (inputs: I, mode: M) => {
      const values: Record<string, number | null> = {};
      for (const quantity of quantities) {
        const saved = untouched(inputs, quantity, mode);
        values[quantity.key] = saved ? saved.exact : quantity.toMetric(inputs, mode);
      }
      return values;
    };

    /** The same measurements expressed in another unit mode. */
    const convert = (inputs: I, from: M, to: M): I => {
      let next = { ...inputs };
      for (const quantity of quantities) {
        const saved = untouched(inputs, quantity, from);
        const exact = saved ? saved.exact : quantity.toMetric(inputs, from);
        const origin = saved ? saved.origin : { mode: from, values: pick(inputs, quantity, from) };
        const values = origin.mode === to ? origin.values : quantity.fromMetric(exact, to, next);
        next = { ...next, ...values };
        memory.current.set(quantity.key, { mode: to, shown: snapshot(next, quantity, to), exact, origin });
      }
      return next;
    };

    const reset = () => memory.current.clear();

    return { metric, convert, reset };
  }, [quantities]);
}
