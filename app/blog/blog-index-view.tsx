"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Breadcrumbs from "../components/breadcrumbs";
import { ArrowRight, BookOpen } from "../components/icons";
import PageHero from "../components/page-hero";
import Reveal from "../components/reveal";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { getToolLink } from "../lib/tool-nav";
import type { PostCard } from "./post-cards";

function formatPostDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function postCategory(post: PostCard) {
  try {
    return getToolLink(post.toolId).shortName;
  } catch {
    return post.toolLabel || "Guide";
  }
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} role="img" aria-hidden="true">
      <title>Search articles</title>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

/** A card alone on its row stays side by side, so a full-width row does not grow taller. */
function FeaturedPostCard({ post, priority = false, latest = false }: { post: PostCard; priority?: boolean; latest?: boolean }) {
  const category = postCategory(post);
  return (
    <article data-niche={post.toolId} className="blog-grid-item blog-grid-item-solo">
      <Link href={`/blog/${post.slug}`} className="spotlight group card-lift card-surface blog-featured-link">
        <div className="blog-featured-media">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="img-zoom object-cover"
            priority={priority}
            unoptimized={isRemoteImage(post.image)}
          />
        </div>
        <div className="blog-featured-body">
          {latest ? <span className="blog-featured-badge">Latest article</span> : null}
          <h2 className="blog-featured-title">{post.title}</h2>
          <p className="muted-copy mt-3 line-clamp-3 sm:text-base sm:leading-7">{post.excerpt}</p>
          <p className="blog-featured-meta">
            <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{category}</span>
          </p>
          <span className="blog-featured-cta">
            Read article
            <ArrowRight className="arrow-nudge h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}

/** Cards that share a row. Two split the row in half, three split it in thirds. */
function GridPostCard({ post, priority = false }: { post: PostCard; priority?: boolean }) {
  const category = postCategory(post);
  return (
    <article data-niche={post.toolId} className="blog-grid-item">
      <Link href={`/blog/${post.slug}`} className="spotlight group card-lift card-surface post-card h-full">
        <div className="relative aspect-16/10 overflow-hidden bg-emerald-50">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="img-zoom object-cover"
            priority={priority}
            unoptimized={isRemoteImage(post.image)}
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="blog-card-meta">
            <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{category}</span>
          </p>
          <h2 className="card-title mt-2">{post.title}</h2>
          <p className="muted-copy mt-2 line-clamp-3">{post.excerpt}</p>
          <span className="blog-card-cta mt-auto">
            Read more
            <ArrowRight className="arrow-nudge h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function BlogIndexView({
  siteUrl,
  posts,
}: {
  siteUrl: string;
  posts: PostCard[];
}) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      const label = postCategory(post);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return [...counts.entries()].map(([label, count]) => ({ label, count }));
  }, [posts]);

  const nextSteps = useMemo(() => {
    const seen = new Set<string>();
    const steps: { title: string; text: string; href: string; label: string }[] = [];
    for (const post of posts) {
      if (seen.has(post.toolId)) continue;
      seen.add(post.toolId);
      try {
        const tool = getToolLink(post.toolId);
        steps.push({
          title: tool.name,
          text: tool.tagline,
          href: post.toolHref,
          label: `Open the ${tool.name}`,
        });
      } catch {
        /* ignore unknown tool ids from remote posts */
      }
    }
    steps.push({
      title: "Browse every tool",
      text: "Calories, macros, due date, and ovulation each have their own calculator page with instructions and limits.",
      href: "/calculators",
      label: "See all calculators",
    });
    return steps;
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const category = postCategory(post);
      if (filter !== "all" && category !== filter) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        post.excerpt.toLowerCase().includes(needle) ||
        category.toLowerCase().includes(needle) ||
        post.toolLabel.toLowerCase().includes(needle)
      );
    });
  }, [filter, query, posts]);

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
          showBackdrop={false}
          image="/blog/adult-barbell-strength-training.jpg"
          imageAlt="Adult in athletic clothes lifting a barbell from the floor during strength training"
          eyebrow="Blog"
          icon={BookOpen}
          title="Health articles"
          description="Guides that explain how our calculators work, what the results mean, and where a single number needs more context."
        >
          <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Blog", href: "/blog" }]} />
        </PageHero>

        <main className="page-main section-block relative z-10">
          <div className="blog-toolbar">
            <div className="blog-filters" role="group" aria-label="Filter articles by topic">
              <button
                type="button"
                className={filter === "all" ? "blog-filter blog-filter-active" : "blog-filter"}
                aria-pressed={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All
                <span className="blog-filter-count">{posts.length}</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.label}
                  type="button"
                  className={filter === category.label ? "blog-filter blog-filter-active" : "blog-filter"}
                  aria-pressed={filter === category.label}
                  onClick={() => setFilter(category.label)}
                >
                  {category.label}
                  <span className="blog-filter-count">{category.count}</span>
                </button>
              ))}
            </div>

            <label className="blog-search">
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles..."
                className="blog-search-input"
              />
              <SearchIcon className="blog-search-icon" />
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="body-copy mt-8 rounded-2xl bg-white p-6 ring-1 ring-slate-900/5">
              No articles match that filter. Try another topic or clear the search.
            </p>
          ) : (
            <div key={`${filter}:${query}`} className="blog-post-grid blog-results mt-8">
              {filtered.map((post, index) => {
                const rowStart = Math.floor(index / 3) * 3;
                const cardsOnRow = Math.min(3, filtered.length - rowStart);
                if (cardsOnRow === 1) {
                  return <FeaturedPostCard key={post.slug} post={post} priority={index === 0} latest={index === 0} />;
                }
                return <GridPostCard key={post.slug} post={post} priority={index === 0} />;
              })}
            </div>
          )}

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
                    <Link
                      href={item.href}
                      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-emerald-700"
                    >
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
