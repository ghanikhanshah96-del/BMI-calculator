"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { toolHref, toolLinks } from "../lib/tool-nav";
import { ArrowUpRight } from "./icons";

/* Starting drift paths live in CSS (server-safe); the client re-rolls each card's path every loop. */
const random = (min: number, max: number) => min + Math.random() * (max - min);
const signed = (magnitude: number) => (Math.random() < 0.5 ? -1 : 1) * random(magnitude * 0.5, magnitude);

function rollPath(el: HTMLElement) {
  el.style.setProperty("--dx1", `${signed(34).toFixed(1)}px`);
  el.style.setProperty("--dy1", `${signed(30).toFixed(1)}px`);
  el.style.setProperty("--dx2", `${signed(36).toFixed(1)}px`);
  el.style.setProperty("--dy2", `${signed(28).toFixed(1)}px`);
  el.style.setProperty("--rot", `${signed(8).toFixed(1)}deg`);
}

export default function HeroToolCards() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".hero-tool-float"));
    const onIteration = (event: AnimationEvent) => {
      if (event.animationName !== "drift") return;
      rollPath(event.currentTarget as HTMLElement);
    };
    cards.forEach((card) => {
      rollPath(card);
      card.style.setProperty("--dur", `${random(7.5, 14).toFixed(1)}s`);
      card.style.setProperty("--delay", `${random(-12, 0).toFixed(1)}s`);
      card.addEventListener("animationiteration", onIteration);
    });
    return () => cards.forEach((card) => card.removeEventListener("animationiteration", onIteration));
  }, []);

  return (
    <div ref={rootRef} className="hero-stage" role="region" aria-label="Calculator shortcuts">
      <span className="hero-orb hero-orb-a" aria-hidden="true" />
      <span className="hero-orb hero-orb-b" aria-hidden="true" />
      <span className="hero-orb hero-orb-c" aria-hidden="true" />
      <div className="hero-floats">
      {toolLinks.map((tool) => {
        return (
          <div key={tool.id} data-niche={tool.id} className="hero-tool-float group">
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
    </div>
  );
}
