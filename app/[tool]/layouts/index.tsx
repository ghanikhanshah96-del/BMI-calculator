import "./layouts.css";
import type { ReactNode } from "react";
import { Blocks, Inline, isShortList } from "../../components/content-blocks";
import FaqAccordion from "../../components/faq-accordion";
import { plainText, type ArticleSection, type ContentBlock, type ToolFaq } from "../../lib/tool-content";

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
                {step.text.map((paragraph) => (
                  <p key={paragraph} className="mt-1.5">
                    <Inline text={paragraph} />
                  </p>
                ))}
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

const LINE = 28;
const GAP = 16;
const lines = (text: string, perLine: number) => Math.max(1, Math.ceil(plainText(text).length / perLine));

/** Estimated height in px of a block stack at half-card width on desktop (about 70 characters per line). */
function blocksHeight(blocks: ContentBlock[], perLine = 70): number {
  return blocks.reduce((sum, block) => {
    switch (block.kind) {
      case "text":
      case "note":
      case "action":
        return sum + GAP + lines(block.text, perLine) * LINE;
      case "formula":
        return sum + GAP + 44 + (lines(block.text, perLine - 10) - 1) * 24;
      case "list": {
        if (block.ordered) return sum + GAP + 32 + block.items.reduce((total, item) => total + lines(item, perLine - 8) * LINE + 6, 0);
        const rows = block.items.map((item) => lines(item, isShortList(block) ? perLine / 2 - 6 : perLine - 4) * LINE + 8);
        if (!isShortList(block)) return sum + GAP + rows.reduce((total, row) => total + row, 0);
        return sum + GAP + rows.slice(0, Math.ceil(rows.length / 2)).reduce((total, row) => total + row, 0);
      }
      case "tables":
        return sum + GAP + block.tables.reduce((total, table) => total + 40 + table.rows.length * 50, 0);
      case "cards":
        return sum + GAP + block.items.reduce((total, card) => total + 90 + blocksHeight(card.blocks, perLine - 8), 0);
      case "terms":
        return sum + GAP + block.items.reduce((total, item) => total + 52 + lines(item.text, perLine - 8) * 26, 0);
    }
  }, 0);
}

const sectionHeight = (section: Extract<ArticleSection, { layout: "prose" }>) =>
  Math.ceil(section.title.length / 34) * 36 + blocksHeight(section.blocks);

/** Pairs whose estimated heights differ by more than this render full width, so the shorter card never leaves a gap. */
const MAX_PAIR_GAP = 90;

/** Half sections pair with the next half section of similar height; any other renders full width. */
function pairedHalves(sections: ArticleSection[]): Set<string> {
  const paired = new Set<string>();
  for (let index = 0; index < sections.length - 1; index += 1) {
    const current = sections[index];
    const next = sections[index + 1];
    if (current.layout !== "prose" || next.layout !== "prose" || !current.half || !next.half) continue;
    if (Math.abs(sectionHeight(current) - sectionHeight(next)) <= MAX_PAIR_GAP) {
      paired.add(current.id);
      paired.add(next.id);
      index += 1;
    }
  }
  return paired;
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
  const halves = pairedHalves(sections);
  return (
    <div className={`tool-article ${className}`}>
      {sections.map((section, index) => {
        const half = halves.has(section.id);
        const classes = [index === 0 ? "mt-6" : "section-gap", half ? "article-half" : ""].join(" ");
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
