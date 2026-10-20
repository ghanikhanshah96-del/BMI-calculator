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
  imageWidth?: number;
  imageHeight?: number;
};

export const postCards: PostCard[] = [
  {
    slug: "how-to-calculate-body-fat-percentage",
    title: "How to Calculate Body Fat Percentage: A Simple Guide",
    excerpt:
      "Learn how to calculate body fat percentage using a simple formula, body measurements, or an online calculator. Follow easy steps and understand your results.",
    toolId: "body-fat",
    toolLabel: "Body Fat Percentage Calculator",
    toolHref: "/body-fat-percentage-calculator",
    updatedAt: "2026-10-21",
    image: "/blog/clinician-waist-circumference-tape.jpg",
    imageAlt: "Clinician holding a tape measure at the waist over clothing",
    imageWidth: 1024,
    imageHeight: 684,
  },
  {
    slug: "how-to-measure-body-fat-at-home",
    title: "How to Measure Body Fat at Home: 3 Simple Methods",
    excerpt:
      "Learn how to measure body fat at home using a measuring tape, online calculator, smart scale, or calipers. Follow simple steps and improve accuracy.",
    toolId: "body-fat",
    toolLabel: "Body Fat Percentage Calculator",
    toolHref: "/body-fat-percentage-calculator",
    updatedAt: "2026-10-21",
    image: "/blog/adult-home-dumbbell-exercise.jpg",
    imageAlt: "Adult sitting on an exercise mat and raising two dumbbells",
    imageWidth: 1024,
    imageHeight: 684,
  },
  {
    slug: "how-many-months-am-i-at-17-weeks",
    title: "How Many Months Am I at 17 Weeks Pregnant?",
    excerpt:
      "How many months am I at 17 weeks pregnant? Learn which pregnancy month and trimester you're in, how weeks convert to months, and what to expect.",
    toolId: "pregnancy",
    toolLabel: "Pregnancy Due Date Calculator",
    toolHref: "/pregnancy-due-date-calculator",
    updatedAt: "2026-10-16",
    image: "/blog/adult-pregnant-green-dress.jpg",
    imageAlt: "Adult in a long green dress standing in profile",
    imageWidth: 1280,
    imageHeight: 996,
  },
  {
    slug: "how-accurate-are-due-dates-for-pregnancy",
    title: "How Accurate Are Due Dates for Pregnancy? What to Expect",
    excerpt:
      "How accurate are due dates for pregnancy? Learn how ultrasound and last-period estimates work, why dates change, and when babies typically arrive.",
    toolId: "pregnancy",
    toolLabel: "Pregnancy Due Date Calculator",
    toolHref: "/pregnancy-due-date-calculator",
    updatedAt: "2026-10-16",
    image: "/blog/adult-pregnant-holding-abdomen.jpg",
    imageAlt: "Adult in a long-sleeved dress standing in profile with both hands resting on the abdomen",
    imageWidth: 1280,
    imageHeight: 960,
  },
  {
    slug: "why-bmi-is-not-accurate-for-muscular-people",
    title: "Why BMI Is Not Accurate for Muscular People",
    excerpt:
      "Find out why BMI is not accurate for muscular people, how muscle mass affects BMI results, and which other measurements can provide more context.",
    toolId: "bmi",
    toolLabel: "BMI Calculator",
    toolHref: "/bmi-calculator",
    updatedAt: "2026-10-10",
    image: "/blog/adult-barbell-strength-training.jpg",
    imageAlt: "Adult in athletic clothes lifting a barbell from the floor during strength training",
  },
];

export function getPostCard(slug: string): PostCard {
  const card = postCards.find((item) => item.slug === slug);
  if (!card) throw new Error(`Unknown post: ${slug}`);
  return card;
}
