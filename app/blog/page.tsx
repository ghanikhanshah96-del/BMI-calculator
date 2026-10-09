import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { getSiteUrl } from "../lib/site-url";
import BlogIndexView from "./blog-index-view";

export const metadata: Metadata = pageMetadata({
  title: "BMI and Muscular People",
  description:
    "Read why BMI is not accurate for muscular people, how muscle mass affects the result, and which other measurements can add context.",
  path: "/blog",
  keywords: ["BMI muscular people", "why BMI is not accurate", "muscle mass and BMI", "BMI vs body fat"],
  image: {
    url: "/blog/adult-barbell-strength-training.jpg",
    alt: "Adult in athletic clothes lifting a barbell from the floor during strength training",
  },
});

export default function BlogIndexPage() {
  return <BlogIndexView siteUrl={getSiteUrl()} />;
}
