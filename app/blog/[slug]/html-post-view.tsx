"use client";

import Link from "next/link";
import Breadcrumbs from "../../components/breadcrumbs";
import { ArticleAuthorCard, ArticleByline } from "../../components/article-author";
import { editorialTeamRef } from "../../lib/editorial-team";
import { ArrowRight, BookOpen } from "../../components/icons";
import PageHero from "../../components/page-hero";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { organizationRef } from "../../lib/seo";
import type { FirestoreBlogPost } from "../../lib/firestore-blog";

const ctaLink =
  "font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white";

function absoluteImage(siteUrl: string, image: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;
}

export default function HtmlPostView({
  siteUrl,
  post,
  articles,
}: {
  siteUrl: string;
  post: FirestoreBlogPost;
  articles: { slug: string; title: string }[];
}) {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const cover = post.coverImage || "/logo.png";
  const heroLocal = cover.startsWith("http") ? "/logo.png" : cover;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: [absoluteImage(siteUrl, cover)],
    datePublished: post.publishedAt || post.date,
    dateModified: post.updatedAt || post.publishedAt || post.date,
    author: editorialTeamRef(siteUrl),
    publisher: organizationRef(siteUrl),
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl, name: post.title, url: postUrl },
    keywords: [post.focusKeyword, ...post.tags].filter(Boolean).join(", "),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="blog" />
      <div className="relative isolate flex flex-1 flex-col">
        <PageHero
          image={heroLocal}
          imageAlt={post.coverImageAlt || post.title}
          eyebrow={post.category || "Guide"}
          icon={BookOpen}
          title={post.title}
          description={
            <>
              <p>{post.excerpt}</p>
              <ArticleByline />
              <p className="mt-3 text-sm text-slate-500">
                <time dateTime={post.date}>Published {post.date}</time>
                {post.updatedAt ? (
                  <>
                    {" · "}
                    <time dateTime={post.updatedAt}>Updated {post.updatedAt}</time>
                  </>
                ) : null}
              </p>
            </>
          }
        >
          <Breadcrumbs
            siteUrl={siteUrl}
            items={[
              { name: "Blog", href: "/blog" },
              { name: post.title, href: `/blog/${post.slug}` },
            ]}
          />
        </PageHero>

        <main className="page-main section-block relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
            <article className="min-w-0">
              {cover.startsWith("http") ? (
                <figure className="article-figure mb-8">
                  {/* Storage download URL from Firebase */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={post.coverImageAlt || post.title} className="h-auto w-full" />
                </figure>
              ) : null}
              <div
                className="prose prose-slate max-w-none prose-headings:text-emerald-950 prose-a:text-emerald-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <p className="mt-10 text-sm text-slate-500">
                This article provides general educational information and is not a substitute for
                professional medical advice. Also read the{" "}
                <Link href="/disclaimer" className="font-semibold text-emerald-700">
                  Disclaimer
                </Link>
                .
              </p>
              <ArticleAuthorCard />
            </article>

            <aside className="space-y-6">
              <div className="cta-panel p-6 sm:p-7">
                <div className="cta-glow" />
                <h2 className="text-xl text-white sm:text-2xl">Browse calculators</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50">
                  Use free fitness and health calculators alongside the limits explained in our guides.
                </p>
                <Link href="/calculators" className="group cta-button">
                  Open calculators
                  <ArrowRight className="arrow-nudge" />
                </Link>
                <p className="mt-4 text-sm text-emerald-50">
                  Or read more on the{" "}
                  <Link href="/blog" className={ctaLink}>
                    blog
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
      <SiteFooter articles={articles} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
