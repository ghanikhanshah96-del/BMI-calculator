import FaqAccordion from "../../components/faq-accordion";
import type { LayoutProps } from "./shared";

/** Body fat: bento steps, gradient result titles, dark formula console. */
export default function BentoLayout({ tool, content }: LayoutProps) {
  return (
    <div className="layout-bento">
      <section id="how-to" aria-labelledby="how-to-title" className="info-section mt-6">
        <h2 id="how-to-title" className="section-title">
          How to use the {tool.name}
        </h2>
        <ol className="bento-grid">
          {content.howToSteps.map((step) => (
            <li key={step} className="bento-tile">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section id="results" aria-labelledby="results-title" className="info-section section-gap">
        <h2 id="results-title" className="section-title">
          Understanding your {tool.shortName} result
        </h2>
        <div className="bento-results">
          {content.interpretation.map((item) => (
            <article key={item.title} className="bento-result">
              <h3>{item.title}</h3>
              <p className="muted-copy mt-2">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="section-gap grid gap-5 lg:grid-cols-5">
        <section id="formula" aria-labelledby="formula-title" className="info-section bento-console lg:col-span-3">
          <h2 id="formula-title" className="section-title text-white">
            The {tool.shortName} formula
          </h2>
          <ul className="mt-5 space-y-2">
            {content.formula.lines.map((line) => (
              <li key={line} className="bento-code">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-emerald-100/85">{content.formula.note}</p>
        </section>
        <section id="example" aria-labelledby="example-title" className="info-section bento-example lg:col-span-2">
          <h2 id="example-title" className="section-title">
            Worked example
          </h2>
          <div className="mt-5 space-y-3">
            {content.example.map((paragraph) => (
              <p key={paragraph} className="muted-copy">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section id="limits" aria-labelledby="limits-title" className="info-section section-gap bento-frame">
        <h2 id="limits-title" className="section-title">
          What the {tool.shortName} result cannot tell you
        </h2>
        <ul className="bento-pills">
          {content.limits.map((limit) => (
            <li key={limit} className="bento-pill">
              {limit}
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="info-section section-gap">
        <h2 id="faq-title" className="section-title">
          {tool.name} FAQ
        </h2>
        <FaqAccordion items={content.faqs} variant="split" className="mt-5" />
      </section>
    </div>
  );
}
