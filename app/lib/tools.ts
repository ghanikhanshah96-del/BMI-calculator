import { clusters, getToolLink, toolHref, type Cluster, type ClusterId, type ToolId, type ToolLink } from "./tool-nav";

export { clusters, toolHref, type Cluster, type ClusterId, type ToolId };

/** Bump when site-wide page content changes; used for sitemap lastModified. */
export const SITE_UPDATED = "2026-10-02";

export type Tool = ToolLink & {
  heroImage: string;
  heroImageAlt: string;
  metaTitle: string;
  /** Use metaTitle as the full <title> instead of appending the site name. */
  metaTitleAbsolute?: boolean;
  metaDescription: string;
  keywords: string[];
  guideSlug: string;
  relatedToolIds: ToolId[];
};

export const tools: Tool[] = [
  {
    ...getToolLink("bmi"),
    heroImage: "/blog/bmi.jpg",
    heroImageAlt: "Person standing on a bathroom scale to check weight for a BMI calculation",
    metaTitle: "BMI Calculator Online | Free Body Mass Index Tool",
    metaTitleAbsolute: true,
    metaDescription:
      "Calculate BMI online for free using height and weight. See your BMI category with this simple BMI Calculator.",
    keywords: [
      "BMI Calculator",
      "BMI Calculator Online",
      "Free BMI Calculator",
      "Body Mass Index Calculator",
      "Calculate BMI",
      "BMI calculator kg and cm",
      "BMI calculator pounds and inches",
    ],
    guideSlug: "why-bmi-is-not-accurate-for-muscular-people",
    relatedToolIds: ["body-fat", "tdee", "macro"],
  },
  {
    ...getToolLink("body-fat"),
    heroImage: "/blog/body-fat.jpg",
    heroImageAlt: "Measuring tape used for waist circumference body composition",
    metaTitle: "Body Fat Percentage Calculator – Estimate Your Body Fat",
    metaTitleAbsolute: true,
    metaDescription:
      "Use our Body Fat Percentage Calculator to estimate your body fat, understand body fat ranges for men and women.",
    keywords: [
      "Body Fat Percentage Calculator",
      "Body Fat Calculator",
      "calculate body fat percentage",
      "body fat percentage for men",
      "body fat percentage for women",
      "body fat percentage chart",
      "healthy body fat percentage",
      "body composition calculator",
      "BMI vs body fat",
      "body fat measurement",
    ],
    guideSlug: "body-fat",
    relatedToolIds: ["bmi", "tdee", "macro"],
  },
  {
    ...getToolLink("tdee"),
    heroImage: "/blog/tdee.jpg",
    heroImageAlt: "Healthy meal prep bowls representing daily calorie planning",
    metaTitle: "TDEE Calculator Online | Free Daily Calorie Calculator",
    metaTitleAbsolute: true,
    metaDescription:
      "Calculate your TDEE online for free and estimate your daily calorie needs based on your age, weight, height, and activity level.",
    keywords: [
      "TDEE Calculator",
      "TDEE Calculator Online",
      "Free TDEE Calculator",
      "Daily Calorie Needs Calculator",
      "Maintenance Calorie Calculator",
    ],
    guideSlug: "tdee",
    relatedToolIds: ["macro", "bmi", "body-fat"],
  },
  {
    ...getToolLink("macro"),
    heroImage: "/blog/macro.jpg",
    heroImageAlt: "Balanced plate with protein vegetables and whole grains",
    metaTitle: "Macro Calculator – Calculate Your Daily Macros",
    metaTitleAbsolute: true,
    metaDescription:
      "Use our Macro Calculator to estimate your daily protein, carbs, fat and calorie needs for weight loss, maintenance or muscle gain.",
    keywords: [
      "Macro Calculator",
      "Macronutrient Calculator",
      "Macros Calculator",
      "Daily Macro Calculator",
      "calculate macros",
      "macro calculator for weight loss",
      "macro calculator for muscle gain",
      "protein carbs fat calculator",
      "macro ratio",
      "daily macros",
    ],
    guideSlug: "macro",
    relatedToolIds: ["tdee", "body-fat", "bmi"],
  },
  {
    ...getToolLink("pregnancy"),
    heroImage: "/blog/pregnancy.jpg",
    heroImageAlt: "Calendar and prenatal planning for pregnancy due date",
    metaTitle: "Pregnancy Due Date Calculator | Free EDD Tool",
    metaTitleAbsolute: true,
    metaDescription:
      "Calculate your due date from your last period or conception date with our free Pregnancy Due Date Calculator.",
    keywords: [
      "Pregnancy Due Date Calculator",
      "Due Date Calculator",
      "Pregnancy Due Date Calculator Online",
      "Free Pregnancy Due Date Calculator",
      "Baby Due Date Calculator",
      "Estimated Due Date Calculator",
      "Due Date Calculator From Last Period",
      "Due Date Calculator From Conception Date",
      "EDD Calculator",
    ],
    guideSlug: "pregnancy",
    relatedToolIds: ["ovulation", "bmi", "tdee"],
  },
  {
    ...getToolLink("ovulation"),
    heroImage: "/blog/ovulation.jpg",
    heroImageAlt: "Calendar marking menstrual cycle and fertile window",
    metaTitle: "Ovulation Calculator – Find Your Fertile Window",
    metaTitleAbsolute: true,
    metaDescription:
      "Use our Ovulation Calculator to estimate your ovulation date, fertile window and most fertile days using your last period and average cycle length.",
    keywords: [
      "Ovulation Calculator",
      "Ovulation Date Calculator",
      "Ovulation and Fertile Window Calculator",
      "Most Fertile Days Calculator",
      "Ovulation Calculator by Cycle Length",
      "Ovulation Calculator for irregular periods",
      "Ovulation Calculator to Get Pregnant",
      "Next Ovulation Calculator",
      "Ovulation Calendar Calculator",
    ],
    guideSlug: "ovulation",
    relatedToolIds: ["pregnancy", "bmi", "tdee"],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
