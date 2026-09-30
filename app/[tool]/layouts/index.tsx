import "./layouts.css";
import FaqAccordion from "../../components/faq-accordion";
import type { ToolContent } from "../../lib/tool-content";
import type { ToolLink } from "../../lib/tool-nav";

/** The guide sections below every calculator; ids match the pill nav. */
export default function ToolSections({ tool, content }: { tool: ToolLink; content: ToolContent }) {
  return (
    <div>
      <section id="how-to" aria-labelledby="how-to-title" className="info-section mt-6">
        <h2 id="how-to-title" className="section-title">
          How to use the {tool.name}
        </h2>
        <ol className="how-track">
          {content.howToSteps.map((step) => (
            <li key={step} className="how-step">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section id="results" aria-labelledby="results-title" className="info-section section-gap">
        <h2 id="results-title" className="section-title">
          Understanding your {tool.shortName} result
        </h2>
        <div className="result-rows">
          {content.interpretation.map((item) => (
            <article key={item.title} className="result-row">
              <h3>{item.title}</h3>
              <p className="muted-copy">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="formula-panel section-gap" data-scroll-group>
        <section id="formula" aria-labelledby="formula-title" className="info-section">
          <h2 id="formula-title" className="section-title text-white">
            The {tool.shortName} formula
          </h2>
          <ul className="mt-5 space-y-2">
            {content.formula.lines.map((line) => (
              <li key={line} className="formula-line">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-emerald-50">{content.formula.note}</p>
        </section>
        <section id="example" aria-labelledby="example-title" className="info-section formula-example">
          <h2 id="example-title" className="section-title text-white">
            Worked example
          </h2>
          <div className="mt-4 space-y-3">
            {content.example.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-emerald-50">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section id="limits" aria-labelledby="limits-title" className="info-section section-gap limits-frame">
        <h2 id="limits-title" className="section-title">
          What the {tool.shortName} result cannot tell you
        </h2>
        <ul className="limits-list">
          {content.limits.map((limit) => (
            <li key={limit} className="limits-item">
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
