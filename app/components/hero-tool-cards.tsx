"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { toolHref, toolLinks, type ToolId } from "../lib/tool-nav";
import { ArrowUpRight } from "./icons";

/* Starting drift paths live in CSS (server-safe); the client re-rolls each card's path every loop. */
const cardPosition: Record<ToolId, string> = {
  bmi: "left-0 top-0",
  "body-fat": "right-0 top-8",
  tdee: "-left-8 top-[36%]",
  macro: "-right-6 top-[44%]",
  pregnancy: "bottom-0 left-6",
  ovulation: "-bottom-2 right-10",
};

const random = (min: number, max: number) => min + Math.random() * (max - min);
const signed = (magnitude: number) => (Math.random() < 0.5 ? -1 : 1) * random(magnitude * 0.45, magnitude);

function rollPath(el: HTMLElement) {
  el.style.setProperty("--dx1", `${signed(14).toFixed(1)}px`);
  el.style.setProperty("--dy1", `${signed(14).toFixed(1)}px`);
  el.style.setProperty("--dx2", `${signed(14).toFixed(1)}px`);
  el.style.setProperty("--dy2", `${signed(14).toFixed(1)}px`);
  el.style.setProperty("--rot", `${signed(5).toFixed(1)}deg`);
}

export default function HeroToolCards() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      !window.matchMedia("(min-width: 1024px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".hero-tool-float"));
    const onIteration = (event: AnimationEvent) => rollPath(event.currentTarget as HTMLElement);
    cards.forEach((card) => {
      rollPath(card);
      card.style.setProperty("--dur", `${random(8, 13).toFixed(1)}s`);
      card.addEventListener("animationiteration", onIteration);
    });
    return () => cards.forEach((card) => card.removeEventListener("animationiteration", onIteration));
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 hidden lg:block">
      {toolLinks.map((tool) => {
        return (
          <div key={tool.id} className={`hero-tool-float group ${cardPosition[tool.id]}`}>
            <span className="stat-glow" />
            <div data-tilt className="relative h-full">
              <Link href={toolHref(tool)} className="spotlight hero-tool">
                <span className="hero-tool-head">
                  <span className="icon-badge hero-tool-icon">
                    <tool.icon className="h-4.5 w-4.5" />
                  </span>
                  <ArrowUpRight className="hero-tool-arrow" />
                </span>
                <span className="hero-tool-name">{tool.name}</span>
                <span className="hero-tool-hint">{tool.hint}</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
