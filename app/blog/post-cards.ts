import type { ToolId } from "../lib/tool-nav";

export type PostCard = {
  slug: string;
  title: string;
  excerpt: string;
  toolId: ToolId;
  toolLabel: string;
  toolHref: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
};

export const postCards: PostCard[] = [
  {
    slug: "bmi",
    title: "What Is BMI? Formula, Categories, and Limits Explained",
    excerpt:
      "Learn how BMI is calculated, what the categories mean, and how to use our free BMI calculator as a starting point, not a diagnosis.",
    toolId: "bmi",
    toolLabel: "BMI Calculator",
    toolHref: "/bmi-calculator",
    updatedAt: "2026-09-30",
    image: "/blog/bmi.jpg",
    imageAlt: "Person standing on a bathroom scale measuring weight for BMI",
  },
  {
    slug: "tdee",
    title: "TDEE & BMR Explained: Mifflin–St Jeor & Katch–McArdle",
    excerpt:
      "Understand basal metabolic rate (BMR), total daily energy expenditure (TDEE), macros, and when our calculator switches from Mifflin–St Jeor to Katch–McArdle.",
    toolId: "tdee",
    toolLabel: "TDEE Calculator",
    toolHref: "/tdee-calculator",
    updatedAt: "2026-09-30",
    image: "/blog/tdee.jpg",
    imageAlt: "Healthy meal prep bowls representing daily calorie planning",
  },
  {
    slug: "body-fat",
    title: "Body Fat Percentage: U.S. Navy Circumference Method",
    excerpt:
      "See how the DoD/U.S. Navy circumference method estimates body fat from waist, neck, height (and hips for women), and when tape measurements help.",
    toolId: "body-fat",
    toolLabel: "Body Fat Calculator",
    toolHref: "/body-fat-calculator",
    updatedAt: "2026-09-30",
    image: "/blog/body-fat.jpg",
    imageAlt: "Measuring tape used for waist circumference body composition",
  },
  {
    slug: "macro",
    title: "How to Set Your Macros: Calories, Protein, Carbs, and Fat",
    excerpt:
      "Estimate daily calories from Mifflin–St Jeor or Katch–McArdle, adjust for your goal, then split carbs, protein, and fat with clear ratio presets.",
    toolId: "macro",
    toolLabel: "Macro Calculator",
    toolHref: "/macro-calculator",
    updatedAt: "2026-09-30",
    image: "/blog/macro.jpg",
    imageAlt: "Balanced plate with protein vegetables and whole grains",
  },
  {
    slug: "pregnancy",
    title: "How Due Dates Are Calculated: LMP, Ultrasound, and IVF",
    excerpt:
      "Estimate your due date from LMP, conception, ultrasound dating, or IVF transfer, then see gestational age, trimester, and days remaining.",
    toolId: "pregnancy",
    toolLabel: "Due Date Calculator",
    toolHref: "/due-date-calculator",
    updatedAt: "2026-09-30",
    image: "/blog/pregnancy.jpg",
    imageAlt: "Calendar and prenatal planning for pregnancy due date",
  },
  {
    slug: "ovulation",
    title: "Ovulation Guide: How to Estimate Your Fertile Window",
    excerpt:
      "Estimate ovulation, fertile days, pregnancy-test timing, next period, and due date if pregnant—plus the next six cycles from your LMP and cycle length.",
    toolId: "ovulation",
    toolLabel: "Ovulation Calculator",
    toolHref: "/ovulation-calculator",
    updatedAt: "2026-09-30",
    image: "/blog/ovulation.jpg",
    imageAlt: "Calendar marking menstrual cycle and fertile window",
  },
];

export function getPostCard(slug: string): PostCard {
  const card = postCards.find((item) => item.slug === slug);
  if (!card) throw new Error(`Unknown post: ${slug}`);
  return card;
}
