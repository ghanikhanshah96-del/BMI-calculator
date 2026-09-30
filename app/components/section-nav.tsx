"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

export type SectionLink = { id: string; label: string };

const GAP_BELOW_NAV = 16;

/** Document offset of an element, unaffected by transforms such as the reveal animation's start offset. */
export function pageTop(el: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
  return top;
}

/** Sections that share a panel scroll to the panel's edge, not their own. */
function scrollTarget(id: string) {
  const section = document.getElementById(id);
  return section?.closest<HTMLElement>("[data-scroll-group]") ?? section;
}

/** Sticky "on this page" pills: a click scrolls the section to just below the nav, and scrolling highlights the section in view. */
export default function SectionNav({ items, className = "" }: { items: readonly SectionLink[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  /** While a pill-triggered scroll runs, scroll-spy must not override the clicked pill. */
  const lockUntil = useRef(0);

  useEffect(() => {
    let frame = 0;
    const spy = () => {
      frame = 0;
      if (performance.now() < lockUntil.current) return;
      const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + GAP_BELOW_NAV + 8;
      let current = items[0]?.id ?? "";
      let lastTop = -Infinity;
      for (const item of items) {
        const el = scrollTarget(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // Side-by-side sections share a top edge; keep the first one so the pills don't flicker.
        if (top <= line && top > lastTop + 1) {
          current = item.id;
          lastTop = top;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(spy);
    };
    const unlock = () => {
      lockUntil.current = 0;
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
    const link = list?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!list || !link || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = scrollTarget(id);
    const nav = navRef.current;
    if (!target || !nav) return;
    event.preventDefault();
    const navHeight = nav.getBoundingClientRect().height;
    const stickyTop = Number.parseFloat(getComputedStyle(nav).top) || 0;
    const top = pageTop(target) - stickyTop - navHeight - GAP_BELOW_NAV;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lockUntil.current = event.timeStamp + 1500;
    setActive(id);
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav ref={navRef} aria-label="On this page" className={`section-nav ${className}`}>
      <ul ref={listRef} className="section-nav-list">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={current ? "section-pill section-pill-active" : "section-pill"}
                onClick={(event) => jump(event, item.id)}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
