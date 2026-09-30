import FaqAccordion from "../../components/faq-accordion";
import type { LayoutProps } from "./shared";

/** Ovulation: numeral grid, stacked result cards, dark glass band. */
export default function SpotlightLayout({ tool, content }: LayoutProps) {
  return (
    <div className="layout-spotlight">
      <section id="how-to" aria-labelledby="how-to-title" className="info-section mt-6">
        <h2 id="how-to-title" className="section-title">
          How to use the {tool.name}
        </h2>
        <ol className="sp-steps">
          {content.howToSteps.map((step) => (
            <li key={step} className="sp-step">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section id="results" aria-labelledby="results-title" className="info-section section-gap mx-auto max-w-4xl">
        <h2 id="results-title" className="section-title">
          Understanding your {tool.shortName} result
        </h2>
        <div className="sp-stack">
          {content.interpretation.map((item) => (
            <article key={item.title} className="sp-card">
              <h3>{item.title}</h3>
              <p className="muted-copy">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="sp-band section-gap">
        <section id="formula" aria-labelledby="formula-title" className="info-section sp-glass">
          <h2 id="formula-title" className="section-title text-white">
            The {tool.shortName} formula
          </h2>
          <ul className="mt-5 space-y-2">
            {content.formula.lines.map((line) => (
              <li key={line} className="sp-line">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-emerald-100/85">{content.formula.note}</p>
        </section>
        <section id="example" aria-labelledby="example-title" className="info-section sp-glass">
          <h2 id="example-title" className="section-title text-white">
            Worked example
          </h2>
          <div className="mt-4 space-y-3">
            {content.example.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-emerald-50/90">
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
        <ul className="sp-checks">
          {content.limits.map((limit) => (
            <li key={limit} className="sp-check">
              {limit}
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="info-section section-gap mx-auto max-w-3xl">
        <h2 id="faq-title" className="section-title">
          {tool.name} FAQ
        </h2>
        <FaqAccordion items={content.faqs} variant="numbered" className="sp-faq mt-5" />
      </section>
    </div>
  );
}
