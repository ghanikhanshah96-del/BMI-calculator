"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import BrandLogo from "./brand-logo";

type FooterLink = { href: string; label: string; hash?: string };

const groups: { id: string; title: string; links: FooterLink[] }[] = [
  {
    id: "tools",
    title: "Tools",
    links: [
      { href: "/#bmi", hash: "bmi", label: "BMI Calculator" },
      { href: "/#tdee", hash: "tdee", label: "TDEE Calculator" },
      { href: "/#macro", hash: "macro", label: "Macro Planner" },
      { href: "/#body-fat", hash: "body-fat", label: "Body Fat Calculator" },
      { href: "/#pregnancy", hash: "pregnancy", label: "Due Date" },
      { href: "/#ovulation", hash: "ovulation", label: "Ovulation" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { href: "/blog/bmi", label: "BMI Guide" },
      { href: "/blog/tdee", label: "TDEE & Calories" },
      { href: "/blog/macro", label: "Macro Planning" },
      { href: "/blog/body-fat", label: "Body Fat Guide" },
      { href: "/blog/pregnancy", label: "Due Date Guide" },
      { href: "/blog/ovulation", label: "Ovulation Guide" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/sitemap-page", label: "Sitemap" },
    ],
  },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

const footerLinkClass =
  "link-grow inline-flex min-h-11 items-center text-slate-300 no-underline hover:text-white md:min-h-0 md:pb-0.5";

function activateToolFromHash(hash: string) {
  const normalized = hash.replace(/^#/, "");
  window.dispatchEvent(
    new CustomEvent("bmi-activate-tool", { detail: { tool: normalized } }),
  );
}

export default function SiteFooter() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

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
    <footer className="defer-render relative isolate mt-auto overflow-hidden bg-slate-950 px-4 pb-8 pt-12 text-white sm:px-6 lg:px-8 lg:pt-16">
      <Image
        src="/images/footer-texture.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={45}
        className="-z-20 object-cover opacity-15"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-slate-950 via-emerald-950/95 to-teal-950/90" />
      <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_65%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-left text-white no-underline"
            >
              <BrandLogo tone="dark" />
            </Link>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-300 md:mx-0 md:max-w-xs">
              Clear, science-based fitness and health calculators with guides to help you plan with confidence.
            </p>
          </div>

          <div className="divide-y divide-white/10 rounded-2xl bg-white/4 px-4 md:contents">
            {groups.map((group) => {
              const open = openGroup === group.id;
              const panelId = `footer-group-${group.id}`;
              return (
                <div key={group.id} className="md:block">
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenGroup(open ? null : group.id)}
                      className="flex min-h-12 w-full items-center justify-between gap-3 text-left uppercase tracking-[0.18em] md:pointer-events-none md:min-h-0 md:cursor-default"
                    >
                      {group.title}
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 text-emerald-300 transition-transform duration-300 md:hidden ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                  </h2>
                  <ul
                    id={panelId}
                    className={`${open ? "grid" : "hidden"} justify-items-start pb-3 text-sm md:mt-4 md:grid md:gap-2.5 md:pb-0`}
                  >
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className={footerLinkClass}
                          onClick={
                            link.hash
                              ? (event) => handleToolClick(event, link.hash as string)
                              : undefined
                          }
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-white/4 px-5 py-5 text-center text-sm text-slate-300 md:mt-12 md:flex-row md:justify-between md:gap-6 md:text-left">
          <nav
            aria-label="Legal"
            className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs md:order-2"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex min-h-11 items-center text-slate-300 underline decoration-slate-500 underline-offset-4 transition hover:text-white hover:decoration-emerald-300 md:min-h-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="order-2 md:order-1">
            &copy; 2026 FitnessCalculatorPro.com. All rights reserved.
          </p>
          <p className="order-3 max-w-xs text-xs leading-5 text-slate-400 md:max-w-sm md:text-right">
            Free BMI, TDEE, macro, body fat, due date, and ovulation calculators.
          </p>
        </div>
      </div>
    </footer>
  );
}
