import FaqAccordion from "../../components/faq-accordion";
import type { LayoutProps } from "./shared";

/** TDEE: horizontal stepper, sweep rows, formula banner, zig-zag limits. */
export default function StepperLayout({ tool, content }: LayoutProps) {
  return (
    <div className="layout-stepper">
      <section id="how-to" aria-labelledby="how-to-title" className="info-section mt-6">
        <h2 id="how-to-title" className="section-title">
          How to use the {tool.name}
        </h2>
        <ol className="stp-track">
          {content.howToSteps.map((step) => (
            <li key={step} className="stp-step">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section id="results" aria-labelledby="results-title" className="info-section section-gap">
        <h2 id="results-title" className="section-title">
          Understanding your {tool.shortName} result
        </h2>
        <div className="stp-rows">
          {content.interpretation.map((item) => (
            <article key={item.title} className="stp-row">
              <h3>{item.title}</h3>
              <p className="muted-copy">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="formula" aria-labelledby="formula-title" className="info-section section-gap stp-banner">
        <h2 id="formula-title" className="section-title text-white">
          The {tool.shortName} formula
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {content.formula.lines.map((line) => (
            <li key={line} className="stp-chip">
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-emerald-50">{content.formula.note}</p>
      </section>

      <section id="example" aria-labelledby="example-title" className="info-section section-gap stp-quote">
        <h2 id="example-title" className="section-title">
          Worked example
        </h2>
        <div className="mt-4 space-y-3">
          {content.example.map((paragraph) => (
            <p key={paragraph} className="body-copy">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section id="limits" aria-labelledby="limits-title" className="info-section section-gap">
        <h2 id="limits-title" className="section-title">
          What the {tool.shortName} result cannot tell you
        </h2>
        <ul className="stp-zigzag">
          {content.limits.map((limit) => (
            <li key={limit} className="stp-zig">
              {limit}
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="info-section section-gap mx-auto max-w-3xl">
        <h2 id="faq-title" className="section-title">
          {tool.name} FAQ
        </h2>
        <FaqAccordion items={content.faqs} className="faq-qchips mt-5" />
      </section>
    </div>
  );
}
