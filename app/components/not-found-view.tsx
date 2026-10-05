"use client";

import Link from "next/link";
import { toolHref, toolLinks } from "../lib/tool-nav";
import { ArrowRight, LayoutGrid } from "./icons";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export default function NotFoundView() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="home" />
      <main className="page-main relative py-14 lg:py-20">
        <div className="hero-orb hero-orb-a" aria-hidden="true" />
        <div className="hero-orb hero-orb-b" aria-hidden="true" />
        <div className="mx-auto max-w-2xl text-center">
          <p className="gradient-text font-display text-7xl font-medium leading-none sm:text-8xl">404</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Page not found</p>
          <h1 className="mt-3 text-4xl text-slate-900 sm:text-5xl">We could not find that page</h1>
          <p className="body-copy mt-4">
            The link may be outdated or the address mistyped. Every calculator now has its own page, so try one of the
            tools below or browse the full list.
          </p>
          <Link href="/calculators" className="btn-gradient group mt-8 rounded-full px-5 py-2.5 text-sm font-semibold">
            <LayoutGrid className="h-4 w-4" />
            All calculators
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolLinks.map((tool) => (
            <li key={tool.id}>
              <Link href={toolHref(tool)} className="spotlight group card-lift card-surface flex items-center gap-3 p-4">
                <span className="icon-badge h-10 w-10 flex-none rounded-xl">
                  <tool.icon className="h-5 w-5" />
                </span>
                <span className="flex-1 font-semibold">{tool.name}</span>
                <ArrowRight className="arrow-nudge text-emerald-600" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
