import type { IconComponent } from "../components/icons";
import { Activity, Apple, CalendarHeart, HeartPulse, Scale, Sparkles } from "../components/icons";

/* Lightweight tool list safe to import from client components (header, footer, page views). */

export type ToolId = "bmi" | "tdee" | "body-fat" | "macro" | "pregnancy" | "ovulation";
export type ClusterId = "body" | "energy" | "pregnancy";

export type ToolLink = {
  id: ToolId;
  slug: string;
  name: string;
  shortName: string;
  cluster: ClusterId;
  icon: IconComponent;
  tagline: string;
  /** Two-to-four word summary for compact cards. */
  hint: string;
};

export type Cluster = {
  id: ClusterId;
  title: string;
  description: string;
};

export const toolLinks: ToolLink[] = [
  {
    id: "bmi",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    shortName: "BMI",
    cluster: "body",
    icon: Scale,
    tagline: "Use BMI for a quick height-to-weight screening estimate.",
    hint: "Healthy weight range",
  },
  {
    id: "body-fat",
    slug: "body-fat-percentage-calculator",
    name: "Body Fat Percentage Calculator",
    shortName: "Body Fat",
    cluster: "body",
    icon: HeartPulse,
    tagline: "Use body measurements to estimate your body fat percentage.",
    hint: "Fat and lean mass",
  },
  {
    id: "tdee",
    slug: "tdee-calculator",
    name: "TDEE Calculator",
    shortName: "TDEE",
    cluster: "energy",
    icon: Activity,
    tagline: "Use TDEE to estimate how many calories you may burn each day.",
    hint: "Daily calorie needs",
  },
  {
    id: "macro",
    slug: "macro-calculator",
    name: "Macro Calculator",
    shortName: "Macros",
    cluster: "energy",
    icon: Apple,
    tagline: "Use your calorie needs to estimate daily protein, carbohydrate, and fat targets.",
    hint: "Protein, carbs and fat",
  },
  {
    id: "pregnancy",
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date Calculator",
    shortName: "Due Date",
    cluster: "pregnancy",
    icon: CalendarHeart,
    tagline: "Estimate when your baby may be due based on the information you provide.",
    hint: "Trimester timeline",
  },
  {
    id: "ovulation",
    slug: "ovulation-calculator",
    name: "Ovulation Calculator",
    shortName: "Ovulation",
    cluster: "pregnancy",
    icon: Sparkles,
    tagline: "Estimate when ovulation and your fertile window may occur during your menstrual cycle.",
    hint: "Fertile window",
  },
];

export const clusters: Cluster[] = [
  {
    id: "body",
    title: "Weight and body composition",
    description: "Screen your weight for height and estimate how much of it is body fat.",
  },
  {
    id: "energy",
    title: "Energy and nutrition",
    description: "Work out daily calorie needs and turn them into protein, carb, and fat targets.",
  },
  {
    id: "pregnancy",
    title: "Pregnancy and fertility",
    description: "Estimate a due date, track pregnancy milestones, and predict your fertile window.",
  },
];

/** Old `/#hash` links from before tools had their own pages. */
export const legacyHashToSlug: Record<string, string> = Object.fromEntries(
  toolLinks.map((tool) => [tool.id, tool.slug]),
);

export function toolHref(tool: Pick<ToolLink, "slug">): string {
  return `/${tool.slug}`;
}

export function getToolLink(id: ToolId): ToolLink {
  const tool = toolLinks.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}

export function toolLinksInCluster(cluster: ClusterId): ToolLink[] {
  return toolLinks.filter((tool) => tool.cluster === cluster);
}
