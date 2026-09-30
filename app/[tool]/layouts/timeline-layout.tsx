import FaqAccordion from "../../components/faq-accordion";
import type { LayoutProps } from "./shared";

/** BMI: connected timeline, joined range band, split formula panel. */
export default function TimelineLayout({ tool, content }: LayoutProps) {
  return (
    <div className="layout-timeline">
      <section id="how-to" aria-labelledby="how-to-title" className="info-section mx-auto mt-6 max-w-3xl">
        <h2 id="how-to-title" className="section-title">
          How to use the {tool.name}
        </h2>
        <ol className="tl-steps">
          {content.howToSteps.map((step) => (
            <li key={step} className="tl-step">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section id="results" aria-labelledby="results-title" className="info-section section-gap">
        <h2 id="results-title" className="section-title">
          Understanding your {tool.shortName} result
        </h2>
        <div className="tl-band">
          {content.interpretation.map((item) => (
            <article key={item.title} className="tl-segment">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="tl-split section-gap">
        <section id="formula" aria-labelledby="formula-title" className="info-section tl-split-formula">
          <h2 id="formula-title" className="section-title">
            The {tool.shortName} formula
          </h2>
          <ul className="mt-5 space-y-2.5">
            {content.formula.lines.map((line) => (
              <li key={line} className="tl-formula-line">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-emerald-50">{content.formula.note}</p>
        </section>
        <section id="example" aria-labelledby="example-title" className="info-section tl-split-example">
          <h2 id="example-title" className="section-title">
            Worked example
          </h2>
          <div className="mt-5 space-y-3">
            {content.example.map((paragraph) => (
              <p key={paragraph} className="body-copy">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section id="limits" aria-labelledby="limits-title" className="info-section section-gap">
        <h2 id="limits-title" className="section-title">
          What the {tool.shortName} result cannot tell you
        </h2>
        <ol className="tl-limits">
          {content.limits.map((limit) => (
            <li key={limit} className="tl-limit">
              {limit}
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="info-section section-gap mx-auto max-w-3xl">
        <h2 id="faq-title" className="section-title">
          {tool.name} FAQ
        </h2>
        <FaqAccordion items={content.faqs} variant="numbered" className="mt-5" />
      </section>
    </div>
  );
}
