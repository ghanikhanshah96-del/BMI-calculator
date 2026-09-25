import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { blogPosts } from "../blog/posts";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Complete sitemap for BMI Wellness Pro: free BMI, TDEE, body fat, macro, pregnancy due date, and ovulation calculators plus guides.",
  alternates: { canonical: "/sitemap-page" },
  robots: { index: true, follow: true },
};

const tools = [
  { href: "/#bmi", label: "BMI Calculator", aim: "Calculate Body Mass Index and healthy weight range" },
  { href: "/#tdee", label: "TDEE Calculator", aim: "Estimate BMR/TDEE (Mifflin or Katch–McArdle), macros, BMI, ideal weight" },
  { href: "/#macro", label: "Macro Planner", aim: "Estimate calories + protein/carbs/fat from Mifflin or Katch–McArdle" },
  { href: "/#body-fat", label: "Body Fat Calculator", aim: "U.S. Navy method with ACE categories and BMI estimate" },
  { href: "/#pregnancy", label: "Due Date Calculator", aim: "Due date from LMP, conception, ultrasound, or IVF" },
  { href: "/#ovulation", label: "Ovulation Calculator", aim: "Fertile window, test day, and next 6 cycles" },
];

export default function HtmlSitemapPage() {
  return (
    <div className="min-h-screen bg-background text-slate-900">
      <SiteHeader activePage="sitemap" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Site map
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          BMI Wellness Pro is a free online suite of health calculators. Use this page to find every tool and guide.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Main pages</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="font-semibold text-emerald-700 hover:underline">
                Home: Health calculators
              </Link>
            </li>
            <li>
              <Link href="/blog" className="font-semibold text-emerald-700 hover:underline">
                Blog: Guides for every calculator
              </Link>
            </li>
            <li>
              <Link href="/contact" className="font-semibold text-emerald-700 hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="font-semibold text-emerald-700 hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="font-semibold text-emerald-700 hover:underline">
                Terms of Use
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Calculators</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="font-semibold text-emerald-700 hover:underline">
                  {tool.label}
                </Link>
                <p className="text-slate-600">{tool.aim}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Calculator guides</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-slate-600">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
