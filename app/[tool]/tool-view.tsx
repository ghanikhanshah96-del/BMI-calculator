"use client";

import Link from "next/link";
import Breadcrumbs from "../components/breadcrumbs";
import { ArrowRight, AlertTriangle, BookOpen, LayoutGrid } from "../components/icons";
import JsonLd from "../components/json-ld";
import PageHero from "../components/page-hero";
import SectionNav from "../components/section-nav";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import ToolCalculator from "../components/tool-calculator";
import { postCards } from "../blog/post-cards";
import { articleNav, plainText, toolContent } from "../lib/tool-content";
import { getToolLink, toolHref, type ToolId } from "../lib/tool-nav";
import { organizationRef, websiteRef } from "../lib/seo";
import type { Tool } from "../lib/tools";
import ToolSections, { ToolLead } from "./layouts";

export type ToolPageProps = Pick<Tool, "id" | "heroImage" | "heroImageAlt" | "metaDescription" | "relatedToolIds">;

export default function ToolView({
  siteUrl,
  updated,
  tool: page,
  clusterTitle,
}: {
  siteUrl: string;
  updated: string;
  tool: ToolPageProps;
  clusterTitle: string;
}) {
  const tool = getToolLink(page.id);
  const content = toolContent[page.id];
  const sections = content.article;
  const sectionLinks = articleNav(sections);
  const sources = content.sources ?? [];
  const guide = postCards.find((card) => card.toolId === page.id);
  const related = page.relatedToolIds.map((id: ToolId) => getToolLink(id));
  const pageUrl = `${siteUrl}${toolHref(tool)}`;

  const jsonLd = [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: tool.name,
        url: pageUrl,
        description: page.metaDescription,
        inLanguage: "en-US",
        isPartOf: websiteRef(siteUrl),
        publisher: organizationRef(siteUrl),
        primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}${page.heroImage}` },
        dateModified: updated,
        ...(sources.length
          ? { citation: sources.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.url })) }
          : {}),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: plainText(faq.answer).replace(/^- /gm, "") },
        })),
      },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="calculators" />
      <div data-niche={page.id} className="bg-mesh flex flex-1 flex-col">
      <PageHero
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
        eyebrow={clusterTitle}
        icon={tool.icon}
        title={tool.name}
        description={<p>{content.intro}</p>}
      >
        <Breadcrumbs
          siteUrl={siteUrl}
          items={[
            { name: "Calculators", href: "/calculators" },
            { name: tool.name, href: toolHref(tool) },
          ]}
        />
      </PageHero>

      <main className="page-main pb-12 lg:pb-16">
        <section id="calculator" aria-label={tool.name} className="tool-panel">
          <ToolCalculator id={tool.id} />
        </section>

        <aside className="result-notice" role="note">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          <p>
            <strong>Estimate only.</strong> Results are for education and planning, not a diagnosis. Talk to a qualified
            healthcare professional before making medical decisions. Read our{" "}
            <Link href="/about">methodology and sources</Link>.
            {sources.length ? (
              <span className="result-notice-sources">
                Sources:{" "}
                {sources.map((source, index) => (
                  <span key={source.url}>
                    {index ? "; " : null}
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.label}
                    </a>
                  </span>
                ))}
                .
              </span>
            ) : null}
          </p>
        </aside>

        {content.lead ? <ToolLead blocks={content.lead} label={`About the ${tool.name}`} /> : null}

        <SectionNav items={sectionLinks} />

        <ToolSections sections={sections} faqs={content.faqs} />

        {guide ? (
          <section aria-label="In-depth guide" className="cta-panel section-gap">
            <div className="cta-glow" />
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-lime-200">
              <BookOpen className="h-4 w-4" />
              In-depth guide
            </p>
            <h2 className="mt-3 text-2xl text-white sm:text-[1.75rem]">{guide.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">{guide.excerpt}</p>
            <Link href={`/blog/${guide.slug}`} className="group cta-button">
              Read the {tool.shortName} guide
              <ArrowRight className="arrow-nudge" />
            </Link>
          </section>
        ) : null}

        <section aria-labelledby="related-tools" className="section-gap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-tools" className="section-title">
              Related calculators
            </h2>
            <Link href="/calculators" className="niche-link link-grow inline-flex items-center gap-1.5 text-sm font-semibold">
              <LayoutGrid className="h-4 w-4" />
              All health calculators
            </Link>
          </div>
          <ul className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={toolHref(item)} data-niche={item.id} className="spotlight group card-lift card-surface related-card">
                  <span className="icon-badge h-11 w-11 rounded-xl">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="related-card-title">{item.name}</span>
                  <span className="muted-copy mt-1">{item.tagline}</span>
                  <span className="related-card-cta">
                    Open calculator
                    <ArrowRight className="arrow-nudge" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      </div>

      <SiteFooter />
      <JsonLd items={jsonLd} />
    </div>
  );
}
