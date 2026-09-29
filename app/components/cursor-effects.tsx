"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], [data-magnetic], [data-tilt], summary, label";
const TEXT_ENTRY = "input, textarea, [contenteditable='true']";
const MAGNET_STRENGTH = 0.25;
const MAGNET_MAX = 10;
const TILT_MAX = 6;

export default function CursorEffects() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let pointerX = -100;
    let pointerY = -100;
    let ringX = -100;
    let ringY = -100;
    let target: Element | null = null;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    let frame = 0;

    const resetMagnet = () => {
      if (!magnet) return;
      magnet.style.setProperty("--mag-x", "0px");
      magnet.style.setProperty("--mag-y", "0px");
      magnet = null;
    };

    const resetTilt = () => {
      if (!tilt) return;
      tilt.style.setProperty("--tilt-x", "0deg");
      tilt.style.setProperty("--tilt-y", "0deg");
      tilt = null;
    };

    const update = () => {
      frame = 0;

      ringX += (pointerX - ringX) * 0.35;
      ringY += (pointerY - ringY) * 0.35;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      const el = target;
      root.classList.toggle("cursor-text", Boolean(el?.closest(TEXT_ENTRY)));
      root.classList.toggle("cursor-hover", Boolean(el?.closest(INTERACTIVE)));

      const spot = el?.closest<HTMLElement>(".spotlight");
      if (spot) {
        const rect = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${pointerX - rect.left}px`);
        spot.style.setProperty("--my", `${pointerY - rect.top}px`);
      }

      const nextMagnet = el?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextMagnet !== magnet) resetMagnet();
      if (nextMagnet) {
        magnet = nextMagnet;
        const rect = nextMagnet.getBoundingClientRect();
        const dx = (pointerX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH;
        const dy = (pointerY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH;
        const clamp = (n: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, n));
        nextMagnet.style.setProperty("--mag-x", `${clamp(dx)}px`);
        nextMagnet.style.setProperty("--mag-y", `${clamp(dy)}px`);
      }

      const nextTilt = el?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (nextTilt !== tilt) resetTilt();
      if (nextTilt) {
        tilt = nextTilt;
        const rect = nextTilt.getBoundingClientRect();
        const px = (pointerX - rect.left) / rect.width - 0.5;
        const py = (pointerY - rect.top) / rect.height - 0.5;
        nextTilt.style.setProperty("--tilt-x", `${(-py * TILT_MAX).toFixed(2)}deg`);
        nextTilt.style.setProperty("--tilt-y", `${(px * TILT_MAX).toFixed(2)}deg`);
      }

      if (Math.abs(pointerX - ringX) > 0.3 || Math.abs(pointerY - ringY) > 0.3) {
        frame = requestAnimationFrame(update);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      target = event.target instanceof Element ? event.target : null;
      if (!root.classList.contains("cursor-ready")) {
        ringX = pointerX;
        ringY = pointerY;
        root.classList.add("cursor-ready");
      }
      schedule();
    };

    const onPointerLeave = () => {
      root.classList.remove("cursor-ready", "cursor-hover", "cursor-text");
      resetMagnet();
      resetTilt();
    };

    const onPointerDown = () => {
      ring.style.scale = "0.9";
    };
    const onPointerUp = () => {
      ring.style.scale = "";
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      root.classList.remove("cursor-ready", "cursor-hover", "cursor-text");
      resetMagnet();
      resetTilt();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
