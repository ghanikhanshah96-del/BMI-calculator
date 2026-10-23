import type { Metadata } from "next";
import Link from "next/link";
import { listCatalogCards } from "../../blog/catalog";
import Breadcrumbs from "../../components/breadcrumbs";
import { ArrowRight, BookOpen } from "../../components/icons";
import JsonLd from "../../components/json-ld";
import PageHero from "../../components/page-hero";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { editorialTeam, editorialTeamRef } from "../../lib/editorial-team";
import { pageMetadata, websiteRef } from "../../lib/seo";
import { getSiteUrl } from "../../lib/site-url";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: editorialTeam.name,
  description: editorialTeam.description,
  path: editorialTeam.path,
});

const topics = [
  "BMI and body composition",
  "Energy needs and TDEE",
  "Macronutrient estimates",
  "Pregnancy date estimates",
  "Ovulation and cycle timing",
  "Calculator methods and limitations",
];

export default async function EditorialTeamPage() {
  const siteUrl = getSiteUrl();
  const posts = await listCatalogCards();
  const author = editorialTeamRef(siteUrl);
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="about" />
      <div className="relative isolate flex flex-1 flex-col">
        <PageHero
          image="/images/overview-wellness.jpg"
          imageAlt="Woman meditating outdoors at sunrise"
          title={editorialTeam.name}
          description={<><p>Clear explanations for the numbers behind your health and fitness goals.</p><p className="mt-3">{editorialTeam.description}</p></>}
        >
          <Breadcrumbs siteUrl={siteUrl} items={[{ name: "Editorial Team", href: editorialTeam.path }]} />
        </PageHero>
        <main className="page-main section-block relative z-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <section aria-labelledby="team-role" className="card-surface p-6 sm:p-8">
              <span className="icon-badge brand-badge" aria-hidden="true"><BookOpen className="h-5 w-5" /></span>
              <h2 id="team-role" className="section-title mt-5">Who is behind this byline?</h2>
              <p className="body-copy mt-4">FitnessCalculatorPro.com publishes calculator guides under a shared editorial identity. This byline identifies the site as responsible for the explanation you are reading, rather than naming an individual contributor.</p>
              <p className="body-copy mt-4">Our focus is practical: what a calculation uses, what its result can tell you, and where that result falls short. A BMI value, calorie estimate, or predicted date is a starting point for understanding a topic, not a complete picture of your health.</p>
              <p className="body-copy mt-4">The team name does not represent a medical qualification or a claim that a clinician has reviewed an article. For advice about symptoms, nutrition needs, pregnancy, or fertility, speak with a qualified healthcare professional.</p>
            </section>
            <section aria-labelledby="team-topics" className="live-frame p-6 sm:p-8">
              <h2 id="team-topics" className="section-title">Topics we cover</h2>
              <p className="body-copy mt-4">Our guides explain the tools available on this site and the context needed to use their estimates thoughtfully.</p>
              <ul className="mt-5 space-y-3">{topics.map((topic) => <li key={topic} className="flex gap-3"><span className="limit-dot" aria-hidden="true" /><span className="body-copy">{topic}</span></li>)}</ul>
            </section>
          </div>
          <section aria-labelledby="team-standards" className="card-surface mt-6 p-6 sm:p-8">
            <h2 id="team-standards" className="section-title">How to read and question our content</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <div><h3 className="text-lg font-semibold">Look at the method</h3><p className="body-copy mt-2">Read the formula, assumptions, and cited references where provided. Different methods can produce different estimates, and no online tool accounts for every personal factor.</p></div>
              <div><h3 className="text-lg font-semibold">Know the editorial standard</h3><p className="body-copy mt-2">Our <Link href="/editorial-policy" className="content-link">editorial policy</Link> explains our approach to sources, original writing, AI assistance, updates, and advertising independence.</p></div>
              <div><h3 className="text-lg font-semibold">Help us correct errors</h3><p className="body-copy mt-2">Use <Link href="/contact-us" className="content-link">Contact Us</Link> to flag an unclear explanation or possible error. Include the article URL and the passage or calculation that needs attention.</p></div>
            </div>
          </section>
          <section aria-labelledby="team-articles" className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="team-articles" className="section-title">Articles by the editorial team</h2>
              <Link href="/blog" className="content-link inline-flex items-center gap-2 font-semibold">Browse the blog <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {posts.map((post) => (
                <li key={post.slug} className="card-surface p-6 sm:p-8">
                  <p className="text-sm font-semibold text-emerald-700">{post.toolLabel}</p>
                  <h3 className="mt-3 text-xl"><Link href={"/blog/" + post.slug} className="content-link">{post.title}</Link></h3>
                  <p className="body-copy mt-3">{post.excerpt}</p>
                  <Link href={"/blog/" + post.slug} className="content-link mt-4 inline-flex items-center gap-2 text-sm font-semibold">Read article <ArrowRight className="h-4 w-4" /></Link>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
      <SiteFooter />
      <JsonLd items={[{
        "@type": "ProfilePage",
        "@id": author.url + "#webpage",
        url: author.url,
        name: editorialTeam.name,
        description: editorialTeam.description,
        inLanguage: "en-US",
        isPartOf: websiteRef(siteUrl),
        mainEntity: author,
      }]} />
    </div>
  );
}
