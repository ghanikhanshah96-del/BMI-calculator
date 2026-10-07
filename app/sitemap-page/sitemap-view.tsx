"use client";

import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Home,
  Info,
  LayoutGrid,
  Mail,
  Map as MapIcon,
  ShieldCheck,
  type IconComponent,
} from "../components/icons";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { postCards } from "../blog/post-cards";
import { toolHref, toolLinks } from "../lib/tool-nav";

type SitemapItem = { href: string; label: string; description?: string; icon: IconComponent; niche?: string };

const mainPages: SitemapItem[] = [
  { href: "/", label: "Home", description: "All six calculators, how they work, and the latest guides", icon: Home },
  { href: "/calculators", label: "All Calculators", description: "Every tool grouped by goal, with tips on which result to check first", icon: LayoutGrid },
  { href: "/blog", label: "Blog", description: "Guides that explain the formula, result, and limits of each calculator", icon: BookOpen },
  { href: "/about", label: "About", description: "Our mission, the formulas we use, and how we review content", icon: Info },
  { href: "/contact", label: "Contact", description: "Send questions, corrections, or feedback to our team", icon: Mail },
  { href: "/privacy", label: "Privacy Policy", description: "What we collect, what stays in your browser, and your choices", icon: ShieldCheck },
  { href: "/terms", label: "Terms of Use", description: "Educational use, medical disclaimers, and responsible use of results", icon: FileText },
];

const toolItems: SitemapItem[] = toolLinks.map((tool) => ({
  href: toolHref(tool),
  label: tool.name,
  description: tool.tagline,
  icon: tool.icon,
  niche: tool.id,
}));

function SitemapSection({ title, intro, items }: { title: string; intro: string; items: SitemapItem[] }) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="section-title">{title}</h2>
      <p className="muted-copy mt-2">{intro}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ href, label, description, icon: Icon, niche }, index) => (
          <Reveal as="li" key={href} delay={(index % 3) * 80} className="h-full">
            <Link href={href} data-niche={niche} className="spotlight group card-lift card-surface tool-card">
              <span className="icon-badge brand-badge">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="sitemap-label">
                  {label}
                  <ArrowUpRight className="sitemap-arrow" />
                </span>
                {description ? <span className="muted-copy mt-1 block">{description}</span> : null}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export default function SitemapView({ siteUrl }: { siteUrl: string }) {
  const guideItems: SitemapItem[] = postCards.map((guide) => ({
    href: `/blog/${guide.slug}`,
    label: guide.title,
    description: guide.excerpt,
    icon: BookOpen,
  }));

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="sitemap" />
      <PageHero
        image="/images/sitemap.jpg"
        imageAlt="Table of fresh vegetables and healthy ingredients"
        eyebrow="Sitemap"
        icon={MapIcon}
        title="Site map"
        description="FitnessCalculatorPro.com is a free online suite of health calculators. Use this page to find every tool and guide."
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Sitemap", href: "/sitemap-page" }]} />
      </PageHero>
      <main className="page-main section-block">
        <section aria-labelledby="site-structure" className="live-frame mb-14 p-6 sm:p-8">
          <h2 id="site-structure" className="section-title">
            How the site is organized
          </h2>
          <div className="mt-3 grid gap-x-10 gap-y-3 lg:grid-cols-2">
            <p className="body-copy">
              Every calculator has its own page with the tool, step-by-step instructions, the formula it uses, a worked
              example, and answers to common questions. Each calculator is paired with an in-depth guide on the blog that
              explains the science and the limits of the result in more detail.
            </p>
            <p className="body-copy">
              The tools are grouped into three areas: weight and body composition (BMI and body fat), energy and
              nutrition (TDEE and macros), and pregnancy and fertility (due date and ovulation). All calculations run in
              your browser, and the numbers you enter are never sent to our servers.
            </p>
          </div>
        </section>
        <SitemapSection
          title="Main pages"
          intro="Start at the home page, browse every tool in the calculator hub, or learn who we are, how we handle your privacy, and the terms for using the site."
          items={mainPages}
        />
        <SitemapSection
          title="Calculators"
          intro="Each calculator has its own page with instructions, a guide to reading your result, and answers to common questions."
          items={toolItems}
        />
        <SitemapSection
          title="Calculator guides"
          intro="In-depth articles that explain the formula behind each calculator, how to interpret your numbers, and when to talk to a professional."
          items={guideItems}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
