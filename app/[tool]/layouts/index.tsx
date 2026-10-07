import "./layouts.css";
import type { ReactNode } from "react";
import { Blocks, Inline } from "../../components/content-blocks";
import FaqAccordion from "../../components/faq-accordion";
import type { ArticleSection, ContentBlock, ToolFaq } from "../../lib/tool-content";

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={`${id}-title`} className="section-title">
      {children}
    </h2>
  );
}

const toneClass = { card: "panel-card", brand: "panel-brand", frame: "panel-frame" } as const;

function Section({
  section,
  className,
  faqs,
  actionHref,
}: {
  section: ArticleSection;
  className: string;
  faqs: ToolFaq[];
  actionHref?: string;
}) {
  const labelledBy = `${section.id}-title`;

  switch (section.layout) {
    case "prose": {
      const tone = section.tone ? toneClass[section.tone] : "panel-card";
      return (
        <section id={section.id} aria-labelledby={labelledBy} className={`info-section ${tone} ${className}`}>
          <SectionTitle id={section.id}>{section.title}</SectionTitle>
          <Blocks blocks={section.blocks} actionHref={actionHref} className="mt-4" />
        </section>
      );
    }

    case "steps":
      return (
        <section id={section.id} aria-labelledby={labelledBy} className={`info-section panel-card ${className}`}>
          <SectionTitle id={section.id}>{section.title}</SectionTitle>
          {section.intro ? (
            <p className="prose-text mt-3">
              <Inline text={section.intro} />
            </p>
          ) : null}
          <ol className="how-track">
            {section.steps.map((step) => (
              <li key={step.title} className="how-step">
                <h3 className="how-step-title">{step.title}</h3>
                <p className="mt-1.5">
                  <Inline text={step.text.join(" ")} />
                </p>
              </li>
            ))}
          </ol>
        </section>
      );

    case "faq":
      return (
        <section id={section.id} aria-labelledby={labelledBy} className={`info-section panel-card ${className}`}>
          <SectionTitle id={section.id}>{section.title}</SectionTitle>
          <FaqAccordion items={faqs} variant="split" className="mt-5" />
        </section>
      );
  }
}

/** The guide sections below every calculator; ids match the pill nav. */
export default function ToolSections({
  sections,
  faqs,
  actionHref,
  className = "",
}: {
  sections: ArticleSection[];
  faqs: ToolFaq[];
  /** Where closing action buttons point; defaults to the calculator panel. */
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={`tool-article ${className}`}>
      {sections.map((section, index) => {
        const classes = index === 0 ? "mt-6" : "section-gap";
        return <Section key={section.id} section={section} className={classes} faqs={faqs} actionHref={actionHref} />;
      })}
    </div>
  );
}

/** Intro copy that follows the calculator, without its own heading. */
export function ToolLead({ blocks, label }: { blocks: ContentBlock[]; label: string }) {
  return (
    <section aria-label={label} className="panel-card mt-6">
      <Blocks blocks={blocks} />
    </section>
  );
}
