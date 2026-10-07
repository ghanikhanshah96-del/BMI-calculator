import Link from "next/link";
import type { ReactNode } from "react";
import Breadcrumbs from "./breadcrumbs";
import DocNav from "./doc-nav";
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
  const contents = sections.map(({ id, title: sectionTitle }) => ({ id, label: sectionTitle }));
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
            <p className="mt-3 text-sm text-slate-500">Last updated: {updated}</p>
          </>
        }
      >
        <Breadcrumbs siteUrl={siteUrl} items={[{ name: crumb, href: path }]} />
      </PageHero>

      <main className="page-main section-block">
        <div className="grid gap-10 lg:grid-cols-[272px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <DocNav items={contents} />
            </div>
          </aside>

          <div className="min-w-0">
            {notice}
            <div className="mt-6 space-y-6 first:mt-0">
              {sections.map(({ id, title: sectionTitle, icon: Icon, body }, index) => (
                <Reveal key={id} id={id} as="section" delay={Math.min(index, 3) * 80} className="scroll-mt-28">
                  <div className="card-surface p-6 sm:p-8">
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

            <aside className="cta-panel mt-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="cta-glow" />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl text-white">{cta.title}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50 sm:text-base">{cta.text}</p>
              </div>
              <Link href="/contact" className="group cta-button shrink-0 lg:mt-0">
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
