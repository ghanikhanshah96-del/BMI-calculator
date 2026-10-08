/**
 * CDC BMI-for-age (2–20 y charts), LMS method.
 * Reference: https://www.cdc.gov/growthcharts/cdc-data-files.htm (bmiagerev)
 *
 * Child mode in this app: completed ages 2–17 (under 18).
 * Adult WHO categories apply at age 18+.
 *
 * Age in whole years → mid-year months (years × 12 + 6), matching CDC guidance
 * when only completed years are known.
 */

import { BMI_LMS_ROWS } from "./bmi-lms-data";

export type Sex = "male" | "female";

export type ChildBmiCategory =
  | "Underweight"
  | "Healthy Weight"
  | "Overweight"
  | "Obesity";

export type ChildBmiAssessment = {
  percentile: number;
  zScore: number;
  category: ChildBmiCategory;
  categoryTone: string;
  /** BMI at the 5th percentile for age/sex (healthy range low). */
  healthyBmiMin: number;
  /** BMI at the 85th percentile for age/sex (healthy range high, exclusive in category). */
  healthyBmiMax: number;
  ageYears: number;
  sex: Sex;
};

type Lms = { L: number; M: number; S: number };

/** Packed rows: [sex(1|2), agemos, L, M, S] */
const ROWS = BMI_LMS_ROWS;

const MALE: Array<{ age: number } & Lms> = [];
const FEMALE: Array<{ age: number } & Lms> = [];

for (const [sex, age, L, M, S] of ROWS) {
  const row = { age, L, M, S };
  if (sex === 1) MALE.push(row);
  else FEMALE.push(row);
}

/** Standard normal CDF (Abramowitz & Stegun 26.2.17). */
function normCdf(z: number): number {
  if (!Number.isFinite(z)) return z > 0 ? 1 : 0;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/** Approximate inverse normal CDF for percentile ↔ BMI (Beasley-Springer-Moro style). */
function normInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number;
  let r: number;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  q = p - 0.5;
  r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

function tableFor(sex: Sex) {
  return sex === "male" ? MALE : FEMALE;
}

/** Linear interpolate LMS at an exact age in months. */
export function interpolateLms(sex: Sex, ageMonths: number): Lms | null {
  const table = tableFor(sex);
  if (!table.length) return null;
  if (ageMonths < table[0].age || ageMonths > table[table.length - 1].age) return null;

  let lo = 0;
  let hi = table.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (table[mid].age <= ageMonths) lo = mid;
    else hi = mid;
  }

  const a = table[lo];
  const b = table[hi];
  if (a.age === ageMonths) return { L: a.L, M: a.M, S: a.S };
  if (b.age === ageMonths) return { L: b.L, M: b.M, S: b.S };

  const t = (ageMonths - a.age) / (b.age - a.age);
  return {
    L: a.L + t * (b.L - a.L),
    M: a.M + t * (b.M - a.M),
    S: a.S + t * (b.S - a.S),
  };
}

/** CDC LMS z-score for BMI. */
export function bmiZScore(bmi: number, { L, M, S }: Lms): number {
  if (!(bmi > 0) || !(M > 0) || !(S > 0)) return NaN;
  if (Math.abs(L) < 1e-7) return Math.log(bmi / M) / S;
  return (Math.pow(bmi / M, L) - 1) / (L * S);
}

/** BMI at a given z-score from LMS parameters. */
export function bmiFromZ(z: number, { L, M, S }: Lms): number {
  if (!(M > 0) || !(S > 0)) return NaN;
  if (Math.abs(L) < 1e-7) return M * Math.exp(S * z);
  return M * Math.pow(1 + L * S * z, 1 / L);
}

export function percentileFromZ(z: number): number {
  return normCdf(z) * 100;
}

function categoryFromPercentile(p: number): { label: ChildBmiCategory; tone: string } {
  // CDC: <5th underweight; 5th–<85th healthy; 85th–<95th overweight; ≥95th obesity
  if (p < 5) return { label: "Underweight", tone: "text-amber-700" };
  if (p < 85) return { label: "Healthy Weight", tone: "text-emerald-700" };
  if (p < 95) return { label: "Overweight", tone: "text-amber-700" };
  return { label: "Obesity", tone: "text-red-700" };
}

/** True for completed ages 2–17 (child/teen BMI-for-age). */
export function isChildBmiAge(ageYears: number): boolean {
  return Number.isFinite(ageYears) && ageYears >= 2 && ageYears < 18;
}

/**
 * Assess BMI with CDC BMI-for-age percentiles.
 * `ageYears` must be an integer 2–17; sex is required.
 */
export function assessChildBmi(bmi: number, ageYears: number, sex: Sex): ChildBmiAssessment | null {
  if (!isChildBmiAge(ageYears) || !(bmi > 0)) return null;

  // Mid-year month when only completed years are collected (CDC guidance).
  const ageMonths = ageYears * 12 + 6;
  const lms = interpolateLms(sex, ageMonths);
  if (!lms) return null;

  const zScore = bmiZScore(bmi, lms);
  if (!Number.isFinite(zScore)) return null;

  const percentile = percentileFromZ(zScore);
  const { label, tone } = categoryFromPercentile(percentile);
  const healthyBmiMin = bmiFromZ(normInv(0.05), lms);
  const healthyBmiMax = bmiFromZ(normInv(0.85), lms);

  return {
    percentile: Number(percentile.toFixed(1)),
    zScore: Number(zScore.toFixed(2)),
    category: label,
    categoryTone: tone,
    healthyBmiMin: Number(healthyBmiMin.toFixed(1)),
    healthyBmiMax: Number(healthyBmiMax.toFixed(1)),
    ageYears,
    sex,
  };
}
