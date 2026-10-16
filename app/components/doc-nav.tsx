"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronUp } from "./icons";
import { pageTop, type SectionLink } from "./section-nav";

/** Space between the sticky site header and a section heading after a jump. */
const HEADER_OFFSET = 64 + 24;

/** Sticky side contents for long documents: highlights the section being read and scrolls to a section on click. */
export default function DocNav({
  items,
  title = "On this page",
  className = "",
}: {
  items: readonly SectionLink[];
  title?: string;
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const barRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  /** While a click-triggered scroll runs, scroll-spy must not override the clicked link. */
  const lockUntil = useRef(0);

  useEffect(() => {
    let frame = 0;
    const spy = () => {
      frame = 0;
      const sections = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);
      if (!sections.length) return;

      const first = sections[0].getBoundingClientRect().top + window.scrollY;
      const last = sections[sections.length - 1].getBoundingClientRect().bottom + window.scrollY;
      const read = (window.scrollY + window.innerHeight - first) / Math.max(1, last - first);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, read))})`;

      if (performance.now() < lockUntil.current) return;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= HEADER_OFFSET + 40) current = section.id;
      }
      setActive(atBottom ? sections[sections.length - 1].id : current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(spy);
    };
    const unlock = () => {
      lockUntil.current = 0;
      schedule();
    };
    spy();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("scrollend", unlock);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scrollend", unlock);
    };
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`a[href="#${CSS.escape(active)}"]`);
    if (!list || !link) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const listTop = list.getBoundingClientRect().top;
    const linkTop = link.getBoundingClientRect().top;
    const next = list.scrollTop + (linkTop - listTop) - (list.clientHeight - link.clientHeight) / 2;
    list.scrollTo({ top: Math.max(0, next), behavior: reduceMotion ? "auto" : "smooth" });
  }, [active]);

  const scrollToY = (top: number) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
  };

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const top = pageTop(target) - HEADER_OFFSET;
    const distance = Math.abs(window.scrollY - top);
    lockUntil.current = performance.now() + Math.min(2200, 450 + distance * 0.45);
    setActive(id);
    scrollToY(top);
    history.replaceState(null, "", `#${id}`);
  };

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === active));

  return (
    <nav aria-label={title} className={`doc-nav ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3">
        <p className="doc-nav-title">{title}</p>
        <span className="doc-nav-count" aria-hidden="true">
          {activeIndex + 1}/{items.length}
        </span>
      </div>
      <div className="doc-nav-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
      <ol ref={listRef} className="doc-nav-list">
        {items.map((item, index) => {
          const state = index === activeIndex ? "doc-nav-link-active" : index < activeIndex ? "doc-nav-link-done" : "";
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={index === activeIndex ? "location" : undefined}
                className={`doc-nav-link ${state}`}
                onClick={(event) => jump(event, item.id)}
              >
                <span className="doc-nav-index" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="min-w-0">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
      <button type="button" className="doc-nav-top" data-tip="Scroll to the top of the page" onClick={() => scrollToY(0)}>
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
        Back to top
      </button>
    </nav>
  );
}
