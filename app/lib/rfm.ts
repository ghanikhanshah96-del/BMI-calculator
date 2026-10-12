/**
 * Relative Fat Mass (RFM / RFMp) — Woolcott & Bergman (Scientific Reports, 2019).
 * Height and waist must use the same units (cm or in). Sex: 0 = male, 1 = female.
 */

export type RfmSex = "male" | "female";

/** Ages supported by the public pediatric body-fat module (safe screening band). */
export const PEDIATRIC_RFM_MIN_AGE = 8;
export const PEDIATRIC_RFM_MAX_AGE = 17;

/** Half-width of the displayed estimate range (±2% → 4-point span). */
export const RFM_RANGE_HALF = 2;

export function isPediatricRfmAge(age: number): boolean {
  return Number.isFinite(age) && age >= PEDIATRIC_RFM_MIN_AGE && age <= PEDIATRIC_RFM_MAX_AGE;
}

/** RFMp for ages 8–14; adult RFM for ages 15–19 (and adults). */
export function relativeFatMassPercent(age: number, sex: RfmSex, height: number, waist: number): number | null {
  if (!(height > 0) || !(waist > 0)) return null;
  const sexCode = sex === "female" ? 1 : 0;
  const ratio = height / waist;
  const pct = age <= 14 ? 74 - 22 * ratio + 5 * sexCode : 64 - 20 * ratio + 12 * sexCode;
  if (!Number.isFinite(pct)) return null;
  return pct;
}

export function rfmEquationLabel(age: number): "RFMp" | "RFM" {
  return age <= 14 ? "RFMp" : "RFM";
}

export function rfmEstimateRange(midpoint: number, half = RFM_RANGE_HALF) {
  const low = Math.max(0, midpoint - half);
  const high = midpoint + half;
  return {
    low: Number(low.toFixed(1)),
    high: Number(high.toFixed(1)),
    midpoint: Number(midpoint.toFixed(1)),
  };
}
