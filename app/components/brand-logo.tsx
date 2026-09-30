import { Scale } from "./icons";

export default function BrandLogo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <>
      <span className="icon-badge brand-badge">
        <Scale className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className={`brand-eyebrow ${dark ? "text-emerald-300" : "text-emerald-700"}`}>
          Health &amp; Fitness Tools
        </span>
        <span className={`brand-name ${dark ? "text-white" : "text-slate-900"}`}>
          FitnessCalculatorPro
          <span className={dark ? "text-lime-300" : "gradient-text"}>.com</span>
        </span>
      </span>
    </>
  );
}
