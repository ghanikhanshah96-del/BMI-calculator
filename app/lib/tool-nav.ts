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
    tagline: "Body mass index, WHO category, and healthy weight range.",
    hint: "Healthy weight range",
  },
  {
    id: "body-fat",
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    shortName: "Body Fat",
    cluster: "body",
    icon: HeartPulse,
    tagline: "U.S. Navy tape method with fat mass, lean mass, and categories.",
    hint: "Fat and lean mass",
  },
  {
    id: "tdee",
    slug: "tdee-calculator",
    name: "TDEE Calculator",
    shortName: "TDEE",
    cluster: "energy",
    icon: Activity,
    tagline: "Maintenance calories, BMR, and goal targets for your activity level.",
    hint: "Daily calorie needs",
  },
  {
    id: "macro",
    slug: "macro-calculator",
    name: "Macro Calculator",
    shortName: "Macros",
    cluster: "energy",
    icon: Apple,
    tagline: "Daily calories plus protein, carb, and fat targets for your goal.",
    hint: "Protein, carbs and fat",
  },
  {
    id: "pregnancy",
    slug: "due-date-calculator",
    name: "Due Date Calculator",
    shortName: "Due Date",
    cluster: "pregnancy",
    icon: CalendarHeart,
    tagline: "Estimated due date, gestational age, and trimester timeline.",
    hint: "Trimester timeline",
  },
  {
    id: "ovulation",
    slug: "ovulation-calculator",
    name: "Ovulation Calculator",
    shortName: "Ovulation",
    cluster: "pregnancy",
    icon: Sparkles,
    tagline: "Ovulation day, fertile window, and your next six cycles.",
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
