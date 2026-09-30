"use client";

import dynamic from "next/dynamic";
import type { ToolId } from "../lib/tool-nav";

/* Separate chunks so each tool page only downloads its own calculator; still server-rendered. */
const calculators = {
  bmi: dynamic(() => import("./bmi-calculator")),
  tdee: dynamic(() => import("./tdee-calculator")),
  "body-fat": dynamic(() => import("./body-fat-calculator")),
  macro: dynamic(() => import("./macro-calculator")),
  pregnancy: dynamic(() => import("./due-date-calculator")),
  ovulation: dynamic(() => import("./ovulation-calculator")),
} satisfies Record<ToolId, unknown>;

export default function ToolCalculator({ id }: { id: ToolId }) {
  const Calculator = calculators[id];
  return <Calculator />;
}
