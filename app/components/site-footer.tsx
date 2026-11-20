"use client";

import { ChevronDown } from "./icons";
import Link from "next/link";
import { useState } from "react";
import { toolHref, toolLinks } from "../lib/tool-nav";
import BrandLogo from "./brand-logo";

type FooterLink = { href: string; label: string };

function buildGroups(): { id: string; title: string; links: FooterLink[] }[] {
  return [
    {
      id: "tools",
      title: "Calculators",
      links: [
        ...toolLinks.map((tool) => ({ href: toolHref(tool), label: tool.name })),
        { href: "/calculators", label: "All calculators" },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        { href: "/about-us", label: "About Us" },
        { href: "/blog", label: "Blog" },
        { href: "/contact-us", label: "Contact Us" },
        { href: "/team/editorial", label: "Editorial Team" },
      ],
    },
  ];
}

const legalLinks: FooterLink[] = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-and-conditions", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/editorial-policy", label: "Editorial policy" },
  { href: "/sitemap-page", label: "Sitemap" },
];

export default function SiteFooter() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groups = buildGroups();

  return (
    <footer className="site-footer">
      <div className="footer-overlay" />
      <div className="footer-glow" />

      <div className="site-container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-14">
          <div className="min-w-0 md:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="group inline-flex min-w-0 max-w-full items-center gap-3 text-left text-white no-underline"
            >
              <BrandLogo tone="dark" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/80">
              Clear, science-based fitness and health calculators with guides to help you plan with confidence.
            </p>
          </div>

          <div className="divide-y divide-white/10 rounded-2xl bg-white/4 px-4 md:contents md:divide-y-0">
            {groups.map((group) => {
              const open = openGroup === group.id;
              const panelId = `footer-group-${group.id}`;
              return (
                <nav key={group.id} aria-label={`Footer ${group.title}`} className="md:block">
                  <h2 className="footer-heading">
                    <span className="hidden md:block">{group.title}</span>
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
                  <div className={open ? "footer-panel footer-panel-open" : "footer-panel"}>
                    <ul id={panelId} className="footer-list">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="link-grow footer-link">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </nav>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="footer-copy">&copy; 2026 FitnessCalculatorPro.com. All rights reserved.</p>
          <nav aria-label="Footer legal" className="flex flex-wrap gap-x-5 gap-y-1">
            {legalLinks.map((link) => <Link key={link.href} href={link.href} className="footer-legal-link">{link.label}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
