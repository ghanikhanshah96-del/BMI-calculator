import FaqAccordion from "../../components/faq-accordion";
import type { LayoutProps } from "./shared";

/** Macros: two-column editorial rows with a sticky title and lead. */
export default function EditorialLayout({ tool, content }: LayoutProps) {
  return (
    <div className="layout-editorial">
      <section id="how-to" aria-labelledby="how-to-title" className="info-section ed-row mt-6">
        <div className="ed-aside">
          <h2 id="how-to-title" className="section-title">
            How to use the {tool.name}
          </h2>
          <p className="ed-lead">Four inputs turn your body stats and goal into daily calorie and gram targets.</p>
        </div>
        <ol className="ed-checklist">
          {content.howToSteps.map((step) => (
            <li key={step} className="ed-check">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section id="results" aria-labelledby="results-title" className="info-section ed-row">
        <div className="ed-aside">
          <h2 id="results-title" className="section-title">
            Understanding your {tool.shortName} result
          </h2>
          <p className="ed-lead">Each macro does a different job. Read the grams as daily averages, not strict rules.</p>
        </div>
        <div className="ed-cards">
          {content.interpretation.map((item) => (
            <article key={item.title} className="ed-card">
              <h3>{item.title}</h3>
              <p className="muted-copy mt-1.5">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="formula" aria-labelledby="formula-title" className="info-section ed-row">
        <div className="ed-aside">
          <h2 id="formula-title" className="section-title">
            The {tool.shortName} formula
          </h2>
          <p className="ed-lead">Calories are set first. Each macro then takes a share of them, converted to grams.</p>
        </div>
        <div>
          <ul className="flex flex-col items-start gap-2.5">
            {content.formula.lines.map((line) => (
              <li key={line} className="ed-pill">
                {line}
              </li>
            ))}
          </ul>
          <p className="muted-copy mt-4">{content.formula.note}</p>
        </div>
      </section>

      <section id="example" aria-labelledby="example-title" className="info-section ed-row">
        <div className="ed-aside">
          <h2 id="example-title" className="section-title">
            Worked example
          </h2>
          <p className="ed-lead">A real set of numbers, run through the Balanced split.</p>
        </div>
        <div className="ed-note">
          {content.example.map((paragraph) => (
            <p key={paragraph} className="body-copy">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section id="limits" aria-labelledby="limits-title" className="info-section ed-row">
        <div className="ed-aside">
          <h2 id="limits-title" className="section-title">
            What the {tool.shortName} result cannot tell you
          </h2>
          <p className="ed-lead">Targets are estimates. Keep these points in mind before you change your plan.</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {content.limits.map((limit) => (
            <li key={limit} className="ed-limit">
              {limit}
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="info-section ed-row">
        <div className="ed-aside">
          <h2 id="faq-title" className="section-title">
            {tool.name} FAQ
          </h2>
          <p className="ed-lead">Quick answers to the questions people ask most about macro targets.</p>
        </div>
        <FaqAccordion items={content.faqs} className="ed-faq" />
      </section>
    </div>
  );
}
