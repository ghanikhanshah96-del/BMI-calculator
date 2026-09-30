"use client";

import { useId, useState } from "react";
import { ChevronDown } from "./icons";

export type FaqEntry = { question: string; answer: string };
export type FaqVariant = "list" | "split" | "cards";

/** Only one answer is open at a time; answers stay in the HTML so they are indexable. */
export default function FaqAccordion({
  items,
  className = "",
  variant = "list",
}: {
  items: FaqEntry[];
  className?: string;
  variant?: FaqVariant;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className={`faq-${variant} ${className}`}>
      {items.map((item, index) => {
        const open = index === openIndex;
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <div key={item.question} className={open ? "faq-item faq-item-open" : "faq-item"}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="faq-summary"
              >
                <span className="faq-question">{item.question}</span>
                <span className="faq-chevron">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} className={open ? "accordion-panel accordion-open" : "accordion-panel"}>
              <div className="accordion-inner" inert={!open}>
                <p className="faq-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
