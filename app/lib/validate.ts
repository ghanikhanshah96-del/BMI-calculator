export type FieldRule = {
  label: string;
  value: number | string | null;
  /** "choice" fields are dropdowns; the message says "choose" instead of "enter". */
  kind?: "number" | "choice";
  min?: number;
  max?: number;
  unit?: string;
};

function joinLabels(labels: string[]) {
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Returns the first user-facing problem with the given fields, or "" when everything is valid. */
export function validateFields(rules: FieldRule[]): string {
  const isEmpty = (rule: FieldRule) => rule.value === null || rule.value === "";
  const missingNumbers = rules.filter((rule) => isEmpty(rule) && rule.kind !== "choice").map((rule) => rule.label);
  const missingChoices = rules.filter((rule) => isEmpty(rule) && rule.kind === "choice").map((rule) => rule.label);

  if (missingNumbers.length || missingChoices.length) {
    const parts: string[] = [];
    if (missingNumbers.length) parts.push(`enter your ${joinLabels(missingNumbers)}`);
    if (missingChoices.length) parts.push(`choose your ${joinLabels(missingChoices)}`);
    return `${capitalize(parts.join(missingNumbers.length > 1 ? ", and " : " and "))}.`;
  }

  for (const rule of rules) {
    if (typeof rule.value !== "number") continue;
    const { min, max, unit = "" } = rule;
    const outOfRange = (min !== undefined && rule.value < min) || (max !== undefined && rule.value > max);
    if (outOfRange) {
      const suffix = unit ? ` ${unit}` : "";
      return `${capitalize(rule.label)} must be between ${min} and ${max}${suffix}.`;
    }
  }
  return "";
}
