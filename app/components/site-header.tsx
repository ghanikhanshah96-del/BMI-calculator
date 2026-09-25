"use client";

import { Menu, Scale, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ActivePage = "home" | "blog" | "privacy" | "terms" | "contact" | "sitemap";

const baseLinkClass =
  "rounded-lg px-3 py-2 text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800";
const activeLinkClass =
  "rounded-lg bg-emerald-700 px-3 py-2 text-white hover:bg-emerald-800";
const mobileLinkClass =
  "block rounded-lg px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800";
const mobileActiveLinkClass =
  "block rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white";

export default function SiteHeader({
  activePage,
}: {
  activePage: ActivePage;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toolsHref = activePage === "home" ? "#tools" : "/#tools";

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const links: { href: string; label: string; page: ActivePage | "tools" }[] = [
    { href: toolsHref, label: "Tools", page: "tools" },
    { href: "/", label: "Home", page: "home" },
    { href: "/blog", label: "Blog", page: "blog" },
    { href: "/contact", label: "Contact", page: "contact" },
    { href: "/privacy", label: "Privacy", page: "privacy" },
    { href: "/terms", label: "Terms", page: "terms" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <Scale className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              BMI Health
            </span>
            <span className="text-lg font-bold text-slate-900 sm:text-xl">
              BMI Wellness Pro
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-700 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.page !== "tools" && activePage === link.page
                  ? activeLinkClass
                  : baseLinkClass
              }
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-800 transition hover:bg-emerald-50 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-emerald-100 bg-white px-4 py-3 sm:px-6 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  link.page !== "tools" && activePage === link.page
                    ? mobileActiveLinkClass
                    : mobileLinkClass
                }
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
