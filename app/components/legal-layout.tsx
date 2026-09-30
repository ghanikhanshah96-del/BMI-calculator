import Link from "next/link";
import type { ReactNode } from "react";
import Breadcrumbs from "./breadcrumbs";
import { ArrowRight, type IconComponent } from "./icons";
import PageHero from "./page-hero";
import Reveal from "./reveal";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export type LegalSection = { id: string; title: string; icon: IconComponent; body: ReactNode[] };

export default function LegalLayout({
  siteUrl,
  page,
  path,
  crumb,
  eyebrow,
  icon,
  title,
  intro,
  updated,
  notice,
  sections,
  cta,
}: {
  siteUrl: string;
  page: "privacy" | "terms";
  path: string;
  crumb: string;
  eyebrow: string;
  icon: IconComponent;
  title: string;
  intro: string;
  updated: string;
  notice?: ReactNode;
  sections: LegalSection[];
  cta: { title: string; text: ReactNode };
}) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage={page} />
      <PageHero
        image="/images/legal.jpg"
        imageAlt="Stethoscope resting on a white sheet"
        eyebrow={eyebrow}
        icon={icon}
        title={title}
        description={
          <>
            <p>{intro}</p>
            <p className="mt-3 text-sm text-emerald-100">Last updated: {updated}</p>
          </>
        }
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: crumb, href: path }]} />
      </PageHero>

      <main className="page-main section-block">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">On this page</p>
              <ul className="mt-4 space-y-1 text-sm">
                {sections.map(({ id, title: sectionTitle }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="block rounded-lg border-l-2 border-transparent px-3 py-2 text-slate-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {sectionTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="max-w-3xl">
            {notice}
            <div className="mt-6 space-y-6 first:mt-0">
              {sections.map(({ id, title: sectionTitle, icon: Icon, body }, index) => (
                <Reveal key={id} id={id} as="section" delay={Math.min(index, 3) * 80} className="scroll-mt-28">
                  <div className="spotlight group card-lift card-surface p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                      <span className="icon-badge h-11 w-11 flex-none rounded-xl">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-2xl text-slate-900">{sectionTitle}</h2>
                    </div>
                    <div className="mt-4 space-y-3 text-base leading-7 text-slate-600">
                      {body.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <aside className="cta-panel mt-10">
              <div className="cta-glow" />
              <h2 className="text-2xl text-white">{cta.title}</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50 sm:text-base">{cta.text}</p>
              <Link href="/contact" className="group cta-button">
                Contact us <ArrowRight className="arrow-nudge" />
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
