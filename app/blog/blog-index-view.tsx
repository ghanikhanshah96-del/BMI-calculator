"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import { ArrowRight, BookOpen } from "../components/icons";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { clusters, getToolLink, toolHref, toolLinksInCluster } from "../lib/tool-nav";
import { postCards as posts } from "./post-cards";

const startingPoints = [
  {
    goal: "Checking your weight",
    text: "Start with the BMI guide for the formula and categories, then read the body fat guide to see how much of your weight is lean mass.",
    href: "/blog/bmi",
    label: "Read the BMI guide",
  },
  {
    goal: "Losing fat or building muscle",
    text: "Read the TDEE guide to find your maintenance calories, then the macro guide to turn that number into protein, carb, and fat targets.",
    href: "/blog/tdee",
    label: "Read the TDEE guide",
  },
  {
    goal: "Planning or tracking a pregnancy",
    text: "The ovulation guide explains the fertile window and cycle timing, and the due date guide covers LMP, ultrasound, and IVF dating.",
    href: "/blog/ovulation",
    label: "Read the ovulation guide",
  },
];

const guideParts = [
  { title: "The formula", text: "Each guide shows the exact equation its calculator uses, with the units and constants spelled out." },
  { title: "Reading the result", text: "Categories, ranges, and targets are explained in plain language so you know what your number means." },
  { title: "Limits and next steps", text: "We list the situations where the estimate can mislead and point to the next useful tool or professional." },
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
      <PageHero
        image="/images/blog-hero.jpg"
        imageAlt="Colorful bowl of fresh vegetables and greens"
        eyebrow="Blog"
        icon={BookOpen}
        title="Guides for every calculator"
        description="Clear overviews of BMI, TDEE, body fat, macros, due date, and ovulation so you know what each tool measures and how to use results responsibly."
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Blog", href: "/blog" }]} />
      </PageHero>
      <main className="page-main section-block">
        <p className="body-copy max-w-3xl">
          Every guide explains the formula behind one calculator, walks through how to read your result, and covers the
          situations where the number can mislead, such as a muscular build, pregnancy, or an irregular cycle. Read a
          guide before or after using its calculator to get more out of your result.
        </p>
        <div className="mt-12 space-y-16">
          {clusters.map((cluster, clusterIndex) => {
            const clusterPosts = posts.filter((post) => getToolLink(post.toolId).cluster === cluster.id);
            return (
              <section key={cluster.id} aria-labelledby={`blog-${cluster.id}`}>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <h2 id={`blog-${cluster.id}`} className="section-title">
                      {cluster.title} guides
                    </h2>
                    <p className="muted-copy mt-1.5">{cluster.description}</p>
                  </div>
                  <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {toolLinksInCluster(cluster.id).map((tool) => (
                      <Link key={tool.id} href={toolHref(tool)} className="link-grow font-semibold text-emerald-700 hover:text-emerald-900">
                        {tool.name}
                      </Link>
                    ))}
                  </p>
                </div>
                <div className="grid gap-7 sm:grid-cols-2">
                  {clusterPosts.map((post, index) => (
                    <Reveal as="article" key={post.slug} delay={index * 110} className="h-full">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="spotlight group card-lift card-surface post-card"
                      >
                        <div className="relative aspect-video overflow-hidden bg-emerald-50">
                          <Image
                            src={post.image}
                            alt={post.imageAlt}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="img-zoom"
                            fetchPriority={clusterIndex === 0 && index === 0 ? "high" : "auto"}
                          />
                          <span className="card-tag">{post.toolLabel}</span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="card-title">
                            {post.title}
                          </h3>
                          <p className="muted-copy mt-2">{post.excerpt}</p>
                          <div className="mt-auto flex items-center justify-between pt-5">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                              Read guide <ArrowRight className="arrow-nudge" />
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
              </section>
            );
          })}
        </div>

        <section aria-labelledby="start-here" className="section-gap">
          <h2 id="start-here" className="section-title">
            Not sure where to start?
          </h2>
          <p className="muted-copy mt-2 max-w-3xl">Pick the goal that fits you best and follow the suggested reading order.</p>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {startingPoints.map((item) => (
              <li key={item.goal} className="card-surface flex flex-col p-6">
                <h3 className="text-lg font-semibold">{item.goal}</h3>
                <p className="muted-copy mt-2">{item.text}</p>
                <Link href={item.href} className="group mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-emerald-700">
                  {item.label}
                  <ArrowRight className="arrow-nudge" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="guide-structure" className="section-gap">
          <h2 id="guide-structure" className="section-title">
            How each guide is structured
          </h2>
          <dl className="mt-6 grid gap-5 md:grid-cols-3">
            {guideParts.map((part, index) => (
              <div key={part.title} className="card-surface flex gap-4 p-6">
                <span className="icon-badge brand-badge text-sm font-semibold" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <dt className="font-semibold text-slate-900">{part.title}</dt>
                  <dd className="muted-copy mt-1">{part.text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </div>
  );
}
