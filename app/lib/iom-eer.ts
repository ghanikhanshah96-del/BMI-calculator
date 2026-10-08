/**
 * IOM / DRI Estimated Energy Requirement (EER) for children & adolescents.
 * Source: Institute of Medicine, Dietary Reference Intakes for Energy (2002/2005).
 *
 * Weight in kg, height in meters, age in completed years.
 * Used for ages 2–17 in this app; adults (18+) use Mifflin–St Jeor elsewhere.
 */

export type Gender = "male" | "female";

/** App activity ids → IOM PA category. */
export type ActivityId = "sedentary" | "light" | "moderate" | "heavy" | "athlete";

type PaLevel = "sedentary" | "low" | "active" | "very";

const ACTIVITY_TO_PA: Record<ActivityId, PaLevel> = {
  sedentary: "sedentary",
  light: "low",
  moderate: "active",
  heavy: "very",
  athlete: "very",
};

/** IOM PA coefficients by sex (ages 3–18). */
const PA_COEFF: Record<Gender, Record<PaLevel, number>> = {
  male: { sedentary: 1.0, low: 1.13, active: 1.26, very: 1.42 },
  female: { sedentary: 1.0, low: 1.16, active: 1.31, very: 1.56 },
};

/** Youngest age this app accepts for TDEE / macros (toddlers). */
export const ENERGY_MIN_AGE = 2;
export const ENERGY_MAX_AGE = 120;

export function isYouthEnergyAge(ageYears: number): boolean {
  return Number.isFinite(ageYears) && ageYears >= ENERGY_MIN_AGE && ageYears < 18;
}

/**
 * IOM EER (kcal/day) for ages 2–17.
 * Growth factor: +20 kcal (ages 2–8) or +25 kcal (ages 9–17).
 * Ages 2 use the same 3–8 equation so toddlers are not blocked.
 */
export function iomEerKcal(
  ageYears: number,
  gender: Gender,
  weightKg: number,
  heightCm: number,
  activity: ActivityId,
): number {
  const heightM = heightCm / 100;
  const pa = PA_COEFF[gender][ACTIVITY_TO_PA[activity]];
  const growth = ageYears < 9 ? 20 : 25;

  if (gender === "male") {
    return 88.5 - 61.9 * ageYears + pa * (26.7 * weightKg + 903 * heightM) + growth;
  }
  return 135.3 - 30.8 * ageYears + pa * (10.0 * weightKg + 934 * heightM) + growth;
}

const ADULT_ACTIVITY_LABELS: Record<ActivityId, string> = {
  sedentary: "Sedentary (office job)",
  light: "Light Exercise (1–2 days/week)",
  moderate: "Moderate Exercise (3–5 days/week)",
  heavy: "Heavy Exercise (6–7 days/week)",
  athlete: "Athlete (2× per day)",
};

/** Four IOM PA levels. Heavy and athlete both map to PA "very", so youth shows one option. */
const YOUTH_ACTIVITY_IDS = ["sedentary", "light", "moderate", "heavy"] as const;

const YOUTH_ACTIVITY_LABELS: Record<(typeof YOUTH_ACTIVITY_IDS)[number], string> = {
  sedentary: "Sedentary (mostly sitting/screen time)",
  light: "Low Active (light play/normal daily movement)",
  moderate: "Active (at least 60 mins of daily active play)",
  heavy: "Very Active (vigorous sports/highly energetic play)",
};

const ADULT_ACTIVITY_IDS = ["sedentary", "light", "moderate", "heavy", "athlete"] as const;

/** Dropdown labels only. IDs stay the same so IOM PA coefficients do not change. */
export function activityChoices(ageYears: number | null): Array<{ id: ActivityId; label: string }> {
  if (ageYears !== null && isYouthEnergyAge(ageYears)) {
    return YOUTH_ACTIVITY_IDS.map((id) => ({ id, label: YOUTH_ACTIVITY_LABELS[id] }));
  }
  return ADULT_ACTIVITY_IDS.map((id) => ({ id, label: ADULT_ACTIVITY_LABELS[id] }));
}

/**
 * Youth has no separate athlete option. Athlete and heavy both use IOM PA "very",
 * so a stored athlete selection is shown as Very Active.
 */
export function activityForAge(ageYears: number | null, activity: ActivityId | ""): ActivityId | "" {
  if (activity === "athlete" && ageYears !== null && isYouthEnergyAge(ageYears)) return "heavy";
  return activity;
}

export function activityPaLabel(gender: Gender, activity: ActivityId): string {
  const level = ACTIVITY_TO_PA[activity];
  const coeff = PA_COEFF[gender][level];
  const names: Record<PaLevel, string> = {
    sedentary: "Sedentary",
    low: "Low active",
    active: "Active",
    very: "Very active",
  };
  return `${names[level]} (PA ${coeff})`;
}
