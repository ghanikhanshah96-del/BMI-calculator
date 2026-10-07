"use client";

import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Mail,
  Newspaper,
  type IconComponent,
} from "./icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toolHref, toolLinks } from "../lib/tool-nav";
import BrandLogo from "./brand-logo";

type ActivePage =
  | "home"
  | "calculators"
  | "all-tools"
  | "blog"
  | "about"
  | "privacy"
  | "terms"
  | "disclaimer"
  | "editorial-policy"
  | "contact"
  | "sitemap";

const baseLinkClass = "group nav-link";
const activeLinkClass = "nav-link-active";

const links: { href: string; label: string; page: ActivePage; icon: IconComponent }[] = [
  { href: "/calculators", label: "All Tools", page: "all-tools", icon: LayoutGrid },
  { href: "/blog", label: "Blog", page: "blog", icon: Newspaper },
  { href: "/about-us", label: "About", page: "about", icon: BadgeCheck },
  { href: "/contact-us", label: "Contact", page: "contact", icon: Mail },
];

function HoverUnderline() {
  return (
    <span className="nav-underline" />
  );
}

export default function SiteHeader({
  activePage,
}: {
  activePage: ActivePage;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen && !toolsOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setToolsOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen, toolsOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
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

  const closeMenus = () => {
    setMenuOpen(false);
    setToolsOpen(false);
  };

  const toggleMenu = () => {
    setMenuMounted(true);
    setMenuOpen((open) => !open);
  };

  const calculatorsActive = activePage === "calculators";
  const headerTone = menuOpen || scrolled ? "site-header-solid" : "site-header-clear";

  return (
    <header className={`site-header ${headerTone}`}>
      <div className="header-bar">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          onClick={closeMenus}
        >
          <BrandLogo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 text-sm font-medium lg:flex">
          <div ref={dropdownRef} className="group/menu relative">
            <button
              type="button"
              aria-expanded={toolsOpen}
              aria-controls="calculators-menu"
              onClick={() => setToolsOpen((open) => !open)}
              className={calculatorsActive ? activeLinkClass : baseLinkClass}
            >
              Calculators
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 group-hover/menu:rotate-180 ${toolsOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
              {calculatorsActive ? null : <HoverUnderline />}
            </button>
            <div
              id="calculators-menu"
              className={`menu-panel ${toolsOpen ? "menu-panel-open" : "menu-panel-closed"}`}
            >
              <div className="menu-card">
                <ul className="grid grid-cols-2 gap-1 p-3">
                  {toolLinks.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={toolHref(tool)}
                        data-niche={tool.id}
                        onClick={closeMenus}
                        className="menu-option menu-tool"
                      >
                        <span className="icon-badge menu-tool-icon">
                          <tool.icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="font-semibold">{tool.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {links.map((link) => {
            const isActive = activePage === link.page;
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? activeLinkClass : baseLinkClass}
                onClick={closeMenus}
              >
                {link.label}
                {isActive ? null : <HoverUnderline />}
              </Link>
            );
          })}
          <Link
            href="/bmi-calculator"
            onClick={closeMenus}
            data-magnetic
            className="btn-gradient group ml-3 rounded-full px-4 py-2 text-sm font-semibold"
          >
            Check your BMI
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          data-open={menuOpen}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          <span className="menu-toggle-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {menuMounted ? (
        <div id="mobile-nav" className="mobile-sheet" data-open={menuOpen} inert={!menuOpen}>
          <nav aria-label="Mobile" className="mobile-sheet-inner">
            <p className="mobile-sheet-label">Calculators</p>
            <ul className="mobile-tool-grid">
              {toolLinks.map((tool) => {
                const href = toolHref(tool);
                const isCurrent = pathname === href;
                return (
                  <li key={tool.id}>
                    <Link
                      href={href}
                      onClick={closeMenus}
                      aria-current={isCurrent ? "page" : undefined}
                      data-niche={tool.id}
                      className={isCurrent ? "group mobile-tool mobile-tool-active" : "group mobile-tool"}
                    >
                      <span className="mobile-tool-icon">
                        <tool.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="mobile-tool-name">{tool.shortName}</span>
                      <span className="mobile-tool-hint">{tool.hint}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="mobile-sheet-label">Explore</p>
            <ul className="mobile-page-list">
              {links.map((link) => {
                const isActive = activePage === link.page;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={isActive ? "group mobile-page-link mobile-page-link-active" : "group mobile-page-link"}
                      onClick={closeMenus}
                    >
                      <span className="mobile-page-icon">
                        <link.icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link href="/bmi-calculator" onClick={closeMenus} className="btn-gradient group mobile-cta">
              Check your BMI
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
