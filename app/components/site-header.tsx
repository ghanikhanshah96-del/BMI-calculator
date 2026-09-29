"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLogo from "./brand-logo";

type ActivePage = "home" | "blog" | "privacy" | "terms" | "contact" | "sitemap";

const baseLinkClass =
  "group relative rounded-full px-3.5 py-2 text-slate-600 transition-colors duration-200 hover:text-emerald-800";
const activeLinkClass =
  "rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-white shadow-md shadow-emerald-600/25";
const mobileLinkClass =
  "block rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-emerald-50 hover:pl-5 hover:text-emerald-800";
const mobileActiveLinkClass =
  "block rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-3 text-base font-medium text-white shadow-md shadow-emerald-600/25";

export default function SiteHeader({
  activePage,
}: {
  activePage: ActivePage;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toolsHref = activePage === "home" ? "#tools" : "/#tools";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={[
        "sticky top-0 z-40 border-b transition-all duration-300 lg:backdrop-blur-xl",
        scrolled
          ? "border-emerald-100/80 bg-white/95 shadow-lg shadow-emerald-900/5 lg:bg-white/80"
          : "border-transparent bg-white/90 lg:bg-white/55",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "py-2.5" : "py-4",
        ].join(" ")}
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          onClick={closeMenu}
        >
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium lg:flex">
          {links.map((link) => {
            const isActive = link.page !== "tools" && activePage === link.page;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={isActive ? activeLinkClass : baseLinkClass}
                onClick={closeMenu}
              >
                {link.label}
                {!isActive && (
                  <span className="absolute inset-x-3.5 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-400 transition-transform duration-300 group-hover:scale-x-100" />
                )}
              </Link>
            );
          })}
          <Link
            href={toolsHref}
            onClick={closeMenu}
            data-magnetic
            className="btn-gradient group ml-3 rounded-full px-4 py-2 text-sm font-semibold"
          >
            Try calculators
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-white/80 text-emerald-800 transition hover:bg-emerald-50 lg:hidden"
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
          className="animate-fade-up bg-white/95 px-4 py-3 shadow-lg shadow-emerald-900/10 sm:px-6 lg:hidden"
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
