"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import { ArrowRight, BookOpen } from "../../components/icons";
import PageHero from "../../components/page-hero";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { organizationRef } from "../../lib/seo";
import { getPostBySlug, type BlogPost } from "../posts";

const INLINE_LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const ctaLink = "font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(INLINE_LINK)) {
    const [raw, label, href] = match;
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <Link key={`${href}-${match.index}`} href={href} className="content-link">
        {label}
      </Link>,
    );
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PostView({ siteUrl, slug }: { siteUrl: string; slug: string }) {
  const post = getPostBySlug(slug);
  if (!post) return null;
  const related = post.relatedSlugs
    .map((relatedSlug) => getPostBySlug(relatedSlug))
    .filter((item): item is BlogPost => Boolean(item));
  const contents = [
    { id: "takeaways-section", label: "Key takeaways" },
    ...post.sections.map((section) => ({ id: sectionId(section.heading), label: section.heading })),
    { id: "questions", label: "Common questions" },
  ];
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [`${siteUrl}${post.image}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: organizationRef(siteUrl),
    publisher: organizationRef(siteUrl),
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl, name: post.title, url: postUrl },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="blog" />
      <PageHero
        image={post.image}
        imageAlt={post.imageAlt}
        eyebrow={post.toolLabel}
        icon={BookOpen}
        title={post.title}
        description={
          <>
            <p>{post.excerpt}</p>
            <p className="mt-3 text-sm text-emerald-100">
              <time dateTime={post.publishedAt}>Published {post.publishedAt}</time>
              {" · "}
              <time dateTime={post.updatedAt}>Updated {post.updatedAt}</time>
            </p>
          </>
        }
      >
        <Breadcrumbs
          siteUrl={siteUrl}
          items={[
            { name: "Blog", href: "/blog" },
            { name: `${post.toolLabel} guide`, href: `/blog/${post.slug}` },
          ]}
        />
      </PageHero>

      <main className="page-main section-block">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <article className="min-w-0">
            <section id="takeaways-section" aria-labelledby="takeaways" className="card-surface mb-10 scroll-mt-28 p-6 sm:p-8">
              <h2 id="takeaways" className="section-title">
                Key takeaways
              </h2>
              <ul className="mt-5 space-y-3">
                {post.takeaways.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="limit-dot" aria-hidden="true" />
                    <p className="body-copy">{item}</p>
                  </li>
                ))}
              </ul>
            </section>
            <div className="space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading} id={sectionId(section.heading)} className="scroll-mt-28">
                  <h2 className="section-title">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="post-copy">
                      {renderInline(paragraph)}
                    </p>
                  ))}
                </section>
              ))}
              <section id="questions" aria-labelledby="common-questions" className="scroll-mt-28">
                <h2 id="common-questions" className="section-title">
                  Common questions
                </h2>
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="mt-5">
                    <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                    <p className="body-copy mt-2">{renderInline(faq.answer)}</p>
                  </div>
                ))}
              </section>
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="In this guide" className="hidden rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-900/5 lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">In this guide</p>
              <ul className="mt-3 space-y-0.5 text-sm">
                {contents.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="toc-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="cta-panel p-6 sm:p-7">
              <div className="cta-glow" />
              <h2 className="text-xl text-white sm:text-2xl">Try the {post.toolLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">
                Put this guide into practice with the free {post.toolLabel} and get an instant educational estimate.
              </p>
              <Link href={post.toolHref} className="group cta-button">
                Open the {post.toolLabel}
                <ArrowRight className="arrow-nudge" />
              </Link>
              <p className="mt-4 text-sm text-emerald-50">
                Or browse{" "}
                <Link href="/calculators" className={ctaLink}>
                  all fitness and health calculators
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <aside className="section-gap">
            <h2 className="text-2xl text-slate-900">Related guides</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="spotlight group card-lift card-surface post-card"
                  >
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="img-zoom"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                        {item.toolLabel}
                      </span>
                      <span className="mt-1.5 text-sm font-semibold leading-snug text-slate-800 group-hover:text-emerald-800">
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </div>
  );
}
