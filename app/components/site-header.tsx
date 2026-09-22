import { Scale } from "lucide-react";
import Link from "next/link";

type ActivePage = "home" | "blog" | "privacy" | "terms";

const baseLinkClass =
  "rounded-full px-3 py-2 text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800";
const activeLinkClass =
  "rounded-full bg-emerald-600 px-3 py-2 text-white shadow-sm shadow-emerald-600/25 hover:bg-emerald-700";

export default function SiteHeader({
  activePage,
}: {
  activePage: ActivePage;
}) {
  const toolsHref = activePage === "home" ? "#tools" : "/#tools";
  const guideHref = activePage === "home" ? "#guide" : "/#guide";

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
            <Scale className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
              BMI Health
            </span>
            <span className="text-xl font-black text-slate-950">BMI Wellness Pro</span>
          </span>
        </Link>

        <nav className="flex min-h-10 flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
          <Link href={toolsHref} className={baseLinkClass}>
            Tools
          </Link>
          <Link href={guideHref} className={baseLinkClass}>
            BMI Guide
          </Link>
          <Link href="/" className={activePage === "home" ? activeLinkClass : baseLinkClass}>
            Home
          </Link>
          <Link href="/blog" className={activePage === "blog" ? activeLinkClass : baseLinkClass}>
            Blog
          </Link>
          <Link
            href="/privacy"
            className={activePage === "privacy" ? activeLinkClass : baseLinkClass}
          >
            Privacy
          </Link>
          <Link href="/terms" className={activePage === "terms" ? activeLinkClass : baseLinkClass}>
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}
