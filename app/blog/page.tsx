import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { getSiteUrl } from "../lib/site-url";
import { blogPosts } from "./posts";

export const metadata: Metadata = {
  title: "Health Calculator Blog",
  description:
    "In-depth guides for BMI, TDEE, body fat, macros, pregnancy due date, and ovulation calculators from BMI Wellness Pro.",
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
    title: "Health Calculator Blog | BMI Wellness Pro",
    description:
      "Detailed articles for every BMI Wellness Pro calculator tool.",
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
    <div className="min-h-screen bg-[var(--background)] text-slate-900">
      <SiteHeader activePage="blog" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Blog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Guides for every calculator
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
            Clear overviews of BMI, TDEE, body fat, macros, due date, and ovulation so you know what each tool measures and how to use results responsibly.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post, index) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-300"
            >
              <Link href={`/blog/${post.slug}`} className="block text-slate-900">
                <div className="relative aspect-[16/10] bg-emerald-50">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    {post.toolLabel}
                  </p>
                  <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">
                    Read guide
                  </span>
                  <time
                    dateTime={post.updatedAt}
                    className="mt-2 block text-xs text-slate-500"
                  >
                    Updated {post.updatedAt}
                  </time>
                </div>
              </Link>
            </article>
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
