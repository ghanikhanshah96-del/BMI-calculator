"use client";

import { Scale } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

const toolLinks = [
  { href: "/#bmi", hash: "bmi", label: "BMI Calculator" },
  { href: "/#tdee", hash: "tdee", label: "TDEE Calculator" },
  { href: "/#macro", hash: "macro", label: "Macro Planner" },
  { href: "/#body-fat", hash: "body-fat", label: "Body Fat Calculator" },
  { href: "/#pregnancy", hash: "pregnancy", label: "Due Date" },
  { href: "/#ovulation", hash: "ovulation", label: "Ovulation" },
];

const resourceLinks = [
  { href: "/blog/bmi", label: "BMI Guide" },
  { href: "/blog/tdee", label: "TDEE & Calories" },
  { href: "/blog/macro", label: "Macro Planning" },
  { href: "/blog/body-fat", label: "Body Fat Guide" },
  { href: "/blog/pregnancy", label: "Due Date Guide" },
  { href: "/blog/ovulation", label: "Ovulation Guide" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

function activateToolFromHash(hash: string) {
  const normalized = hash.replace(/^#/, "");
  window.dispatchEvent(
    new CustomEvent("bmi-activate-tool", { detail: { tool: normalized } }),
  );
}

export default function SiteFooter() {
  const pathname = usePathname();

  const handleToolClick = (
    event: MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    if (pathname !== "/") return;

    event.preventDefault();
    const nextHash = `#${hash}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
    activateToolFromHash(hash);
  };

  return (
    <footer className="border-t border-emerald-100 bg-slate-900 px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 text-white no-underline">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Scale className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  BMI Health
                </span>
                <span className="text-lg font-bold text-white">BMI Wellness Pro</span>
              </span>
            </Link>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              Tools
            </h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              {toolLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-300 no-underline transition hover:text-white"
                  onClick={(event) => handleToolClick(event, link.hash)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              Resources
            </h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              {resourceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-300 no-underline transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              Company
            </h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link href="/blog" className="text-slate-300 no-underline transition hover:text-white">
                Blog
              </Link>
              <Link href="/contact" className="text-slate-300 no-underline transition hover:text-white">
                Contact
              </Link>
              <Link href="/sitemap-page" className="text-slate-300 no-underline transition hover:text-white">
                Sitemap
              </Link>
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-300 no-underline transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 BMI Wellness Pro. All rights reserved.</p>
          <p>Free BMI, TDEE, macro, body fat, due date, and ovulation calculators.</p>
        </div>
      </div>
    </footer>
  );
}
