"use client";

import Image from "next/image";
import Link from "next/link";
import ToolSections from "./[tool]/layouts";
import { Inline } from "./components/content-blocks";
import HeroToolCards from "./components/hero-tool-cards";
import { ArrowRight } from "./components/icons";
import JsonLd from "./components/json-ld";
import LegacyHashRedirect from "./components/legacy-hash-redirect";
import Reveal from "./components/reveal";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import { homeFaqs, homeHero, homeSections, popularCalculators } from "./lib/content/home";
import { plainText } from "./lib/content/blocks";
import { defaultOgImage, organizationRef, websiteRef } from "./lib/seo";
import { getToolLink, toolHref, toolLinks } from "./lib/tool-nav";

export default function HomeView({ siteUrl, headlineClass }: { siteUrl: string; headlineClass: string }) {
  const structuredData = [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      name: homeHero.title,
      url: `${siteUrl}/`,
      inLanguage: "en-US",
      isPartOf: websiteRef(siteUrl),
      publisher: organizationRef(siteUrl),
      primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}${defaultOgImage.url}` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: toolLinks.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: `${siteUrl}${toolHref(tool)}`,
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: homeFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: plainText(faq.answer) },
      })),
    },
  ];

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="home" />

      <main className="flex-1">
        {/* Hero */}
        <section aria-labelledby="home-title" className="relative isolate overflow-hidden">
          <div className="absolute inset-y-0 right-0 -z-20 hidden w-[62%] lg:block">
            <Image
              src="/images/hero-bg.jpg"
              alt="Healthy breakfast plate with eggs, greens, tomatoes, and avocado on a wooden table"
              fill
              quality={45}
              sizes="62vw"
              className="object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#f6fbf8] via-[#f6fbf8]/90 to-[#f6fbf8]/40" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-[#f6fbf8] to-transparent" />
          <div className="ambient-orb absolute -left-40 -top-10 -z-10 h-128 w-lg rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.35),transparent_65%)]" />

          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-8 pb-10 sm:px-6 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pt-14 lg:pb-14">
            <div className="min-w-0">
              <h1
                id="home-title"
                className={`${headlineClass} text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]`}
              >
                Free Fitness &amp; <span className="gradient-text">Health Calculators</span>
              </h1>
              {homeHero.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  {paragraph}
                </p>
              ))}
              <a
                href="#popular-calculators"
                data-magnetic
                className="group btn-gradient mt-8 min-h-12 max-w-full rounded-full px-6 text-sm font-semibold sm:text-base"
              >
                <span className="min-w-0">{homeHero.action}</span>
                <ArrowRight className="arrow-nudge" />
              </a>
            </div>

            <HeroToolCards />
          </div>
        </section>

        {/* Popular calculators */}
        <section
          id="popular-calculators"
          aria-labelledby="popular-calculators-title"
          className="section-block relative isolate scroll-mt-16 overflow-hidden"
        >
          <Image
            src="/images/tools-bg.jpg"
            alt="Balanced salad bowl with avocado, chickpeas, sweet potato, and tomatoes"
            fill
            quality={45}
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-emerald-950/95 via-emerald-900/90 to-teal-900/85" />

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="popular-calculators-title" className="section-title text-white">
              {popularCalculators.title}
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {popularCalculators.items.map((item, index) => {
                const tool = getToolLink(item.id);
                const detail = item.paragraphs[1].replace(/\*\*/g, "");
                return (
                  <Reveal as="li" key={item.id} delay={(index % 3) * 100} className="min-w-0">
                    <article data-niche={item.id} data-tip={detail} className="spotlight group card-lift card-surface popular-card">
                      <div className="flex items-center gap-3">
                        <span className="icon-badge h-11 w-11 rounded-xl">
                          <tool.icon className="h-5 w-5" />
                        </span>
                        <p className="popular-card-kicker">{tool.hint}</p>
                      </div>
                      <h3 className="popular-card-title">{item.title}</h3>
                      <p className="popular-card-text">
                        <Inline text={item.paragraphs[0]} />
                      </p>
                      <Link href={toolHref(tool)} className="popular-card-link">
                        {item.link}
                        <ArrowRight className="arrow-nudge" />
                      </Link>
                    </article>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <ToolSections sections={homeSections} faqs={homeFaqs} actionHref="#popular-calculators" className="pt-4" />
        </div>
      </main>

      <SiteFooter />
      <LegacyHashRedirect />
      <JsonLd items={structuredData} />
    </div>
  );
}
