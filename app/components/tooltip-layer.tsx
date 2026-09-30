"use client";

import { useEffect, useRef } from "react";
import { toolHref, toolLinks } from "../lib/tool-nav";

const TARGETS = "a[href], button, input, select, textarea, summary, [role='option'], [role='button'], [data-tip]";
const SHOW_DELAY = 350;
const GAP = 10;
const EDGE = 8;

const pageNames: Record<string, string> = {
  "/": "the home page",
  "/calculators": "all calculators",
  "/blog": "the health guides",
  "/about": "the About page",
  "/contact": "the Contact page",
  "/privacy": "the privacy policy",
  "/terms": "the terms of use",
  "/sitemap-page": "the site map",
  ...Object.fromEntries(toolLinks.map((tool) => [toolHref(tool), `the ${tool.name}`])),
};

const clean = (text: string | null | undefined, max = 80) => {
  const value = (text ?? "").replace(/\s+/g, " ").trim();
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

function fieldLabel(el: HTMLElement) {
  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const text = labelledBy
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent ?? "")
      .join(" ");
    if (clean(text)) return clean(text);
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    const label = el.labels?.[0]?.textContent;
    if (clean(label)) return clean(label);
  }
  const caption = el.closest(".field-box")?.querySelector(".field-caption")?.textContent;
  if (clean(caption)) return clean(caption);
  return clean(el.getAttribute("placeholder")) || clean(el.getAttribute("name")) || "this field";
}

function linkTip(link: HTMLAnchorElement) {
  const raw = link.getAttribute("href") ?? "";
  const text = clean(link.textContent, 60);
  if (raw.startsWith("mailto:")) return `Email ${raw.slice(7).split("?")[0]}`;
  if (raw.startsWith("tel:")) return `Call ${raw.slice(4)}`;
  if (raw.startsWith("#")) return text ? `Jump to ${text}` : "Jump to this section";
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return `Open ${url.hostname.replace(/^www\./, "")} in a new tab`;
  const path = url.pathname.replace(/\/$/, "") || "/";
  if (pageNames[path]) return `Open ${pageNames[path]}`;
  if (path.startsWith("/blog/")) return text ? `Read ${text}` : "Read this guide";
  return text ? `Open ${text}` : "Open this page";
}

/** Tooltip text: explicit data-tip, then aria-label, then a description derived from the element. */
export function resolveTip(el: HTMLElement): string {
  const explicit = clean(el.dataset.tip, 120);
  if (explicit) return explicit;

  const popup = el.getAttribute("aria-haspopup");
  if (popup && popup !== "false") {
    const name =
      clean(el.getAttribute("aria-label")?.split(":")[0]) ||
      clean(el.closest(".field-box")?.querySelector(".field-caption")?.textContent) ||
      clean(document.getElementById(el.getAttribute("aria-labelledby")?.split(" ")[0] ?? "")?.textContent) ||
      clean(el.textContent);
    if (popup === "dialog") return `Pick ${name || "a date"}`;
    if (popup === "listbox") return `Choose ${name || "an option"}`;
  }

  const aria = clean(el.getAttribute("aria-label"), 120);
  if (aria) return aria;

  if (el instanceof HTMLAnchorElement) return linkTip(el);
  if (el.getAttribute("role") === "option") return `Select ${clean(el.textContent) || "this option"}`;
  if (el instanceof HTMLInputElement) {
    if (el.type === "checkbox" || el.type === "radio") return `Toggle ${fieldLabel(el)}`;
    if (el.type === "submit" || el.type === "button") return clean(el.value) || "Submit";
    return `Enter ${fieldLabel(el)}`;
  }
  if (el instanceof HTMLSelectElement) return `Choose ${fieldLabel(el)}`;
  if (el instanceof HTMLTextAreaElement) return `Write ${fieldLabel(el)}`;
  if (el.tagName === "SUMMARY") return `Show or hide ${clean(el.textContent) || "details"}`;

  const text = clean(el.textContent);
  const expanded = el.getAttribute("aria-expanded");
  if (expanded) return `${expanded === "true" ? "Hide" : "Show"} ${text || "more"}`;
  if (el.getAttribute("type") === "submit") return text ? `Submit: ${text}` : "Submit the form";
  return text || "Activate";
}

declare global {
  interface Window {
    __resolveTip?: (el: HTMLElement) => string;
  }
}

/** One delegated tooltip bubble for every interactive element on the page. */
export default function TooltipLayer() {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.webdriver) window.__resolveTip = resolveTip;
    const bubble = bubbleRef.current;
    if (!bubble || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const label = bubble.firstElementChild as HTMLElement;

    let current: HTMLElement | null = null;
    let timer = 0;

    const hide = () => {
      window.clearTimeout(timer);
      current = null;
      bubble.classList.remove("tip-visible");
    };

    const place = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      const { offsetWidth: w, offsetHeight: h } = bubble;
      const below = rect.top - h - GAP < EDGE;
      const center = rect.left + rect.width / 2;
      const left = Math.min(Math.max(center - w / 2, EDGE), window.innerWidth - w - EDGE);
      const top = below ? rect.bottom + GAP : rect.top - h - GAP;
      bubble.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
      bubble.style.setProperty("--arrow-x", `${Math.round(Math.min(Math.max(center - left, 12), w - 12))}px`);
      bubble.dataset.side = below ? "bottom" : "top";
    };

    const show = (target: HTMLElement) => {
      const text = resolveTip(target);
      if (!text || !target.isConnected) return;
      current = target;
      label.textContent = text;
      bubble.classList.remove("tip-visible");
      place(target);
      bubble.classList.add("tip-visible");
    };

    const schedule = (target: HTMLElement, delay: number) => {
      if (target === current) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => show(target), delay);
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(TARGETS);
      if (!target) return;
      schedule(target, current ? 60 : SHOW_DELAY);
    };

    const onPointerOut = (event: PointerEvent) => {
      const from = (event.target as Element | null)?.closest<HTMLElement>(TARGETS);
      const to = (event.relatedTarget as Element | null)?.closest?.<HTMLElement>(TARGETS) ?? null;
      if (from && from !== to) hide();
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(TARGETS);
      if (target?.matches(":focus-visible")) schedule(target, 0);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };

    const onScroll = () => {
      if (current) hide();
    };

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("pointerdown", hide, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", hide);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", hide, { passive: true });

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", hide);
    };
  }, []);

  return (
    <div ref={bubbleRef} className="tip-bubble" aria-hidden="true">
      <span />
    </div>
  );
}
