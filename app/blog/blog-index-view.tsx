"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import { ArrowRight, BookOpen } from "../components/icons";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { postCards as posts } from "./post-cards";

const nextSteps = [
  {
    title: "Check a BMI result",
    text: "Use the BMI Calculator for a height-and-weight screening number, then read the article before treating that number as body fat.",
    href: "/bmi-calculator",
    label: "Open the BMI Calculator",
  },
  {
    title: "Add a body-fat estimate",
    text: "The Body Fat Percentage Calculator uses tape measurements and can add context when muscle makes BMI look high.",
    href: "/body-fat-percentage-calculator",
    label: "Open the Body Fat Percentage Calculator",
  },
  {
    title: "Browse every tool",
    text: "Calories, macros, due date, and ovulation each have their own calculator page with instructions and limits.",
    href: "/calculators",
    label: "See all calculators",
  },
];

export default function BlogIndexView({ siteUrl }: { siteUrl: string }) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="blog" />
      <div className="relative isolate flex flex-1 flex-col">
      <PageHero
        image="/blog/adult-barbell-strength-training.jpg"
        imageAlt=""
        eyebrow="Blog"
        icon={BookOpen}
        title="Health articles"
        description="One published article explains why BMI can misclassify muscular people and which other measurements add context."
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Blog", href: "/blog" }]} />
      </PageHero>
      <main className="page-main section-block relative z-10">
        <p className="body-copy">
          BMI compares weight with height. It does not separate muscle from fat. The article below walks through the
          formula, the standard adult categories, and the situations where a high result needs more than the BMI number.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal as="article" key={post.slug} delay={index * 110} className="h-full">
              <Link href={`/blog/${post.slug}`} data-niche={post.toolId} className="spotlight group card-lift card-surface post-card">
                <div className="relative aspect-[2/1] overflow-hidden bg-emerald-50">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="img-zoom object-cover"
                    priority={index === 0}
                  />
                  <span className="card-tag">{post.toolLabel}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="card-title">{post.title}</h2>
                  <p className="muted-copy mt-2 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      Read article <ArrowRight className="arrow-nudge" />
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

        <section aria-labelledby="next-steps" className="section-gap">
          <h2 id="next-steps" className="section-title">
            Use a calculator with the article
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {nextSteps.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 90} className="h-full">
                <div className="card-surface flex h-full flex-col p-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="muted-copy mt-2">{item.text}</p>
                  <Link href={item.href} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-emerald-700">
                    {item.label}
                    <ArrowRight className="arrow-nudge" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>
      </div>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </div>
  );
}
