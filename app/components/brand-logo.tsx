import { Scale } from "lucide-react";

export default function BrandLogo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <>
      <span className="icon-badge h-10 w-10 flex-none rounded-xl">
        <Scale className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span
          className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-emerald-300" : "text-emerald-700"}`}
        >
          Health &amp; Fitness Tools
        </span>
        <span
          className={`block truncate font-display text-[1.05rem] font-medium leading-tight sm:text-xl ${dark ? "text-white" : "text-slate-900"}`}
        >
          FitnessCalculatorPro
          <span className={dark ? "text-lime-300" : "gradient-text"}>.com</span>
        </span>
      </span>
    </>
  );
}
