import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { getSiteUrl } from "../lib/site-url";
import { blogPosts } from "./posts";

export const metadata: Metadata = {
  title: "Health Calculator Blog",
  description:
    "In-depth guides for BMI, TDEE, body fat, macros, pregnancy due date, and ovulation calculators from FitnessCalculatorPro.com.",
  keywords: [
    "BMI blog",
    "TDEE guide",
    "body fat guide",
    "macro planner guide",
    "due date guide",
    "ovulation guide",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Health Calculator Blog | FitnessCalculatorPro.com",
    description:
      "Detailed articles for every FitnessCalculatorPro.com calculator tool.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const siteUrl = getSiteUrl();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: blogPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="blog" />
      <PageHero
        image="/images/blog-hero.jpg"
        imageAlt="Colorful bowl of fresh vegetables and greens"
        eyebrow="Blog"
        icon={BookOpen}
        title="Guides for every calculator"
        description="Clear overviews of BMI, TDEE, body fat, macros, due date, and ovulation so you know what each tool measures and how to use results responsibly."
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Reveal
              as="article"
              key={post.slug}
              delay={(index % 3) * 110}
              className="h-full"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="spotlight group card-lift flex h-full flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5"
              >
                <div className="relative aspect-video overflow-hidden bg-emerald-50">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white shadow-md">
                    {post.toolLabel}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-sans text-lg font-semibold leading-snug tracking-normal text-slate-900 transition group-hover:text-emerald-800">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      Read guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                    <time dateTime={post.updatedAt} className="text-xs text-slate-500">
                      Updated {post.updatedAt}
                    </time>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </div>
  );
}
