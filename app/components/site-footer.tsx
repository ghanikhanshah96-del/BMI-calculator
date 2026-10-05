"use client";

import { ChevronDown } from "./icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toolHref, toolLinks } from "../lib/tool-nav";
import BrandLogo from "./brand-logo";

type FooterLink = { href: string; label: string };

const groups: { id: string; title: string; links: FooterLink[] }[] = [
  {
    id: "tools",
    title: "Calculators",
    links: [
      ...toolLinks.map((tool) => ({ href: toolHref(tool), label: tool.name })),
      { href: "/calculators", label: "All calculators" },
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
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/sitemap-page", label: "Sitemap" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

export default function SiteFooter() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <footer className="defer-render site-footer">
      <Image
        src="/images/footer-texture.jpg"
        alt="Layered salad jar with fresh vegetables and grains"
        fill
        sizes="100vw"
        quality={45}
        className="-z-20 object-cover opacity-15"
      />
      <div className="footer-overlay" />
      <div className="footer-glow" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <div className="divide-y divide-white/10 rounded-2xl bg-white/4 px-4 md:contents md:divide-y-0">
            {groups.map((group) => {
              const open = openGroup === group.id;
              const panelId = `footer-group-${group.id}`;
              return (
                <div key={group.id} className="md:block">
                  <h2 className="footer-heading">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenGroup(open ? null : group.id)}
                      className="footer-toggle"
                    >
                      {group.title}
                      <ChevronDown
                        aria-hidden="true"
                        className={`footer-chevron ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                  </h2>
                  <ul
                    id={panelId}
                    className={`${open ? "grid" : "hidden"} footer-list md:grid`}
                  >
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="link-grow footer-link">
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

        <p className="footer-copy">&copy; 2026 FitnessCalculatorPro.com. All rights reserved.</p>
      </div>
    </footer>
  );
}
