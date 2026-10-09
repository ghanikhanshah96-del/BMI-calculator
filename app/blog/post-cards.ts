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
