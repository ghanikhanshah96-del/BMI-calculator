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
import DocNav from "../../components/doc-nav";
import MobileArticleContents from "../../components/mobile-article-contents";
import { articleHeadings } from "../../lib/article-headings";
import "../article.css";

const ctaLink =
  "font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white";

function absoluteImage(siteUrl: string, image: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;
}

export default function HtmlPostView({
  siteUrl,
  post,
}: {
  siteUrl: string;
  post: FirestoreBlogPost;
}) {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const cover = post.coverImage || "/logo.png";
  const { html, headings } = articleHeadings(post.content);
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
          showBackdrop={false}
          image={cover}
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
            <article className="order-1 min-w-0">
              <MobileArticleContents items={headings} />
              {post.coverImage ? (
                <figure className="article-figure mb-8">
                  {/* Both local media routes and external cover URLs use the article image slot. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={post.coverImageAlt || post.title} fetchPriority="high" decoding="async" className="block h-auto w-full" />
                </figure>
              ) : null}
              <div
                className="article-body card-surface p-6 sm:p-8"
                dangerouslySetInnerHTML={{ __html: html }}
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

            <aside className="order-2 flex flex-col gap-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-6.5rem)] lg:self-start">
              {headings.length ? <DocNav items={headings} title="In this article" className="hidden min-h-0 lg:flex lg:flex-1" /> : null}
              <div className="cta-panel shrink-0 p-6 sm:p-7">
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
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
