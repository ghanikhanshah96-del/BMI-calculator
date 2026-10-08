export default function BrandLogo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <>
      <img
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 flex-none rounded-xl object-cover shadow-md shadow-emerald-900/25"
      />
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
