"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../../components/breadcrumbs";
import { Inline } from "../../components/content-blocks";
import DocNav from "../../components/doc-nav";
import { ArrowRight, BookOpen } from "../../components/icons";
import PageHero from "../../components/page-hero";
import Reveal from "../../components/reveal";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { organizationRef } from "../../lib/seo";
import { getPostBySlug, plainPostText, type PostBlock, type PostFigure } from "../posts";

const ctaLink = "font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white";

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ArticleFigure({ figure, priority = false }: { figure: PostFigure; priority?: boolean }) {
  return (
    <figure className="article-figure">
      <Image
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        sizes="(max-width: 768px) 100vw, 720px"
        priority={priority}
        className="h-auto w-full"
      />
      <figcaption className="article-caption">
        <Inline text={figure.caption} />
      </figcaption>
    </figure>
  );
}

function ArticleBlocks({ blocks, priorityFirstFigure = false }: { blocks: PostBlock[]; priorityFirstFigure?: boolean }) {
  const firstFigure = priorityFirstFigure ? blocks.findIndex((block) => block.kind === "figure") : -1;
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "p") {
          return (
            <p key={`p-${index}`} className="post-copy">
              <Inline text={block.text} />
            </p>
          );
        }
        if (block.kind === "h3") {
          return (
            <h3 key={`h3-${index}`} id={sectionId(block.text)} className="mt-8 text-xl font-semibold text-slate-900">
              {block.text}
            </h3>
          );
        }
        if (block.kind === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List key={`list-${index}`} className={block.ordered ? "calc-list mt-4" : "dot-list mt-4"}>
              {block.items.map((item) => (
                <li key={item}>
                  <Inline text={item} />
                </li>
              ))}
            </List>
          );
        }
        if (block.kind === "table") {
          return (
            <div key={`table-${index}`} className="data-table-wrap my-6">
              <table className="data-table">
                <caption>{block.caption}</caption>
                <thead>
                  <tr>
                    {block.head.map((cell) => (
                      <th key={cell} scope="col">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell, cellIndex) =>
                        cellIndex === 0 ? (
                          <th key={cell} scope="row">
                            {cell}
                          </th>
                        ) : (
                          <td key={cell}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <ArticleFigure key={block.figure.src} figure={block.figure} priority={index === firstFigure} />;
      })}
    </>
  );
}

export default function PostView({ siteUrl, slug }: { siteUrl: string; slug: string }) {
  const post = getPostBySlug(slug);
  if (!post) return null;
  const contents = [
    { id: "takeaways-section", label: "Key takeaways" },
    ...post.sections.map((section) => ({ id: sectionId(section.heading), label: section.heading })),
    { id: "questions", label: "Frequently Asked Questions" },
  ];
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const articleJsonLd = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: plainPostText(faq.answer) },
      })),
    },
  ];

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="blog" />
      <div className="relative isolate flex flex-1 flex-col">
      <PageHero
        image={post.image}
        imageAlt=""
        eyebrow={post.toolLabel}
        icon={BookOpen}
        title={post.title}
        description={
          <>
            <p>{post.excerpt}</p>
            <p className="mt-3 text-sm text-slate-500">
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
            { name: post.title, href: `/blog/${post.slug}` },
          ]}
        />
      </PageHero>

      <main className="page-main section-block relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <article className="min-w-0">
            <ArticleBlocks blocks={post.intro} priorityFirstFigure />
            <section id="takeaways-section" aria-labelledby="takeaways" className="live-frame mb-10 scroll-mt-28 p-6 sm:p-8">
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
            <div className="space-y-6">
              {post.sections.map((section, index) => (
                <Reveal key={section.heading} delay={Math.min(index, 2) * 60}>
                  <section id={sectionId(section.heading)} className="card-surface scroll-mt-28 p-6 sm:p-8">
                    <h2 className="section-title">{section.heading}</h2>
                    <ArticleBlocks blocks={section.blocks} />
                  </section>
                </Reveal>
              ))}
              <section id="questions" aria-labelledby="common-questions" className="scroll-mt-28">
                <h2 id="common-questions" className="section-title">
                  Frequently Asked Questions
                </h2>
                <div className="mt-5 grid gap-4">
                  {post.faqs.map((faq) => (
                    <article key={faq.question} className="card-surface p-5 sm:p-6">
                      <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                      <p className="body-copy mt-2">
                        <Inline text={faq.answer} />
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="cta-panel p-6 sm:p-7">
              <div className="cta-glow" />
              <h2 className="text-xl text-white sm:text-2xl">Try the {post.toolLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">
                Use the free {post.toolLabel} to see your screening result, then read it alongside the limits explained
                in this article.
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

            <div className="sticky top-24 hidden lg:block">
              <DocNav items={contents} title="In this article" />
            </div>
          </aside>
        </div>
      </main>
      </div>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </div>
  );
}
