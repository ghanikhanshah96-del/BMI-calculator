import {
  Activity,
  Apple,
  ArrowUpRight,
  BookOpen,
  CalendarHeart,
  FileText,
  HeartPulse,
  Home,
  Map as MapIcon,
  Mail,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { blogPosts } from "../blog/posts";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Complete sitemap for FitnessCalculatorPro.com: free BMI, TDEE, body fat, macro, pregnancy due date, and ovulation calculators plus guides.",
  alternates: { canonical: "/sitemap-page" },
  robots: { index: true, follow: true },
};

type SitemapItem = { href: string; label: string; description?: string; icon: LucideIcon };

const mainPages: SitemapItem[] = [
  { href: "/", label: "Home", description: "All health calculators in one place", icon: Home },
  { href: "/blog", label: "Blog", description: "Guides for every calculator", icon: BookOpen },
  { href: "/contact", label: "Contact", description: "Questions and feedback", icon: Mail },
  { href: "/privacy", label: "Privacy Policy", description: "How your information is handled", icon: ShieldCheck },
  { href: "/terms", label: "Terms of Use", description: "Educational use and disclaimers", icon: FileText },
];

const tools: SitemapItem[] = [
  { href: "/#bmi", label: "BMI Calculator", description: "Calculate Body Mass Index and healthy weight range", icon: Scale },
  { href: "/#tdee", label: "TDEE Calculator", description: "Estimate BMR/TDEE (Mifflin or Katch–McArdle), macros, BMI, ideal weight", icon: Activity },
  { href: "/#macro", label: "Macro Planner", description: "Estimate calories + protein/carbs/fat from Mifflin or Katch–McArdle", icon: Apple },
  { href: "/#body-fat", label: "Body Fat Calculator", description: "U.S. Navy method with ACE categories and BMI estimate", icon: HeartPulse },
  { href: "/#pregnancy", label: "Due Date Calculator", description: "Due date from LMP, conception, ultrasound, or IVF", icon: CalendarHeart },
  { href: "/#ovulation", label: "Ovulation Calculator", description: "Fertile window, test day, and next 6 cycles", icon: Sparkles },
];

const guides: SitemapItem[] = blogPosts.map((post) => ({
  href: `/blog/${post.slug}`,
  label: post.title,
  description: post.excerpt,
  icon: BookOpen,
}));

function SitemapSection({ title, items, columns }: { title: string; items: SitemapItem[]; columns: string }) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="text-2xl text-slate-900 sm:text-[1.75rem]">{title}</h2>
      <ul className={`mt-6 grid gap-4 ${columns}`}>
        {items.map(({ href, label, description, icon: Icon }, index) => (
          <Reveal as="li" key={href} delay={(index % 3) * 80} className="h-full">
            <Link
              href={href}
              className="spotlight group card-lift flex h-full items-start gap-4 rounded-2xl bg-white p-5 text-slate-900 shadow-sm ring-1 ring-slate-900/5"
            >
              <span className="icon-badge h-10 w-10 flex-none rounded-xl">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2 font-semibold leading-snug text-slate-900 group-hover:text-emerald-800">
                  {label}
                  <ArrowUpRight className="mt-0.5 h-4 w-4 flex-none text-emerald-500 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </span>
                {description ? (
                  <span className="mt-1 line-clamp-2 block text-sm leading-6 text-slate-600">{description}</span>
                ) : null}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export default function HtmlSitemapPage() {
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
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SitemapSection title="Main pages" items={mainPages} columns="sm:grid-cols-2 lg:grid-cols-3" />
        <SitemapSection title="Calculators" items={tools} columns="sm:grid-cols-2 lg:grid-cols-3" />
        <SitemapSection title="Calculator guides" items={guides} columns="sm:grid-cols-2 lg:grid-cols-3" />
      </main>
      <SiteFooter />
    </div>
  );
}
