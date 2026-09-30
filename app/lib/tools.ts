import { clusters, getToolLink, toolHref, type Cluster, type ClusterId, type ToolId, type ToolLink } from "./tool-nav";

export { clusters, toolHref, type Cluster, type ClusterId, type ToolId };

/** Bump when site-wide page content changes; used for sitemap lastModified. */
export const SITE_UPDATED = "2026-09-30";

export type Tool = ToolLink & {
  heroImage: string;
  heroImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  guideSlug: string;
  relatedToolIds: ToolId[];
};

export const tools: Tool[] = [
  {
    ...getToolLink("bmi"),
    heroImage: "/blog/bmi.jpg",
    heroImageAlt: "Person standing on a bathroom scale measuring weight for BMI",
    metaTitle: "BMI Calculator: Healthy Weight",
    metaDescription:
      "Free BMI calculator for adults. Enter height and weight in metric or US units to see your body mass index, WHO category, and healthy weight range.",
    keywords: ["BMI calculator", "body mass index calculator", "healthy weight range", "BMI chart", "BMI for adults"],
    guideSlug: "bmi",
    relatedToolIds: ["body-fat", "tdee", "macro"],
  },
  {
    ...getToolLink("body-fat"),
    heroImage: "/blog/body-fat.jpg",
    heroImageAlt: "Measuring tape used for waist circumference body composition",
    metaTitle: "Body Fat Percentage Calculator",
    metaDescription:
      "Estimate body fat percentage with the U.S. Navy circumference method. Enter height, neck, waist, and hips to see fat mass, lean mass, and ACE category.",
    keywords: ["body fat calculator", "body fat percentage", "US Navy body fat", "lean body mass", "body composition calculator"],
    guideSlug: "body-fat",
    relatedToolIds: ["bmi", "tdee", "macro"],
  },
  {
    ...getToolLink("tdee"),
    heroImage: "/blog/tdee.jpg",
    heroImageAlt: "Healthy meal prep bowls representing daily calorie planning",
    metaTitle: "TDEE Calculator: Daily Calories",
    metaDescription:
      "Calculate your total daily energy expenditure and BMR with Mifflin-St Jeor or Katch-McArdle. See maintenance calories, cut and bulk targets, and macros.",
    keywords: ["TDEE calculator", "BMR calculator", "maintenance calories", "daily calorie calculator", "Mifflin St Jeor"],
    guideSlug: "tdee",
    relatedToolIds: ["macro", "bmi", "body-fat"],
  },
  {
    ...getToolLink("macro"),
    heroImage: "/blog/macro.jpg",
    heroImageAlt: "Balanced plate with protein vegetables and whole grains",
    metaTitle: "Macro Calculator for Your Goal",
    metaDescription:
      "Free macro calculator: get daily calories plus protein, carb, and fat grams for weight loss, maintenance, or muscle gain, with four macro split presets.",
    keywords: ["macro calculator", "macronutrient calculator", "protein calculator", "IIFYM calculator", "calories and macros"],
    guideSlug: "macro",
    relatedToolIds: ["tdee", "body-fat", "bmi"],
  },
  {
    ...getToolLink("pregnancy"),
    heroImage: "/blog/pregnancy.jpg",
    heroImageAlt: "Calendar and prenatal planning for pregnancy due date",
    metaTitle: "Pregnancy Due Date Calculator",
    metaDescription:
      "Estimate your pregnancy due date from your last period, conception date, ultrasound, or IVF transfer. See gestational age, trimester, and key milestones.",
    keywords: ["due date calculator", "pregnancy calculator", "pregnancy due date", "how far along am I", "trimester calculator"],
    guideSlug: "pregnancy",
    relatedToolIds: ["ovulation", "bmi", "tdee"],
  },
  {
    ...getToolLink("ovulation"),
    heroImage: "/blog/ovulation.jpg",
    heroImageAlt: "Calendar marking menstrual cycle and fertile window",
    metaTitle: "Ovulation Calendar Calculator",
    metaDescription:
      "Predict your ovulation day, fertile window, pregnancy test date, and next period. Plan ahead with dates for your next six cycles based on your cycle length.",
    keywords: ["ovulation calculator", "fertile window calculator", "ovulation predictor", "when do I ovulate", "fertility calendar"],
    guideSlug: "ovulation",
    relatedToolIds: ["pregnancy", "bmi", "tdee"],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
