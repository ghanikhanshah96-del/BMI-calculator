"use client";

import { useEffect } from "react";

const MAGNET_STRENGTH = 0.25;
const MAGNET_MAX = 10;
const TILT_MAX = 6;

export default function CursorEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let pointerX = -100;
    let pointerY = -100;
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

      const el = target;
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

      if (magnet || tilt || el?.closest(".spotlight")) {
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
      schedule();
    };

    const onPointerLeave = () => {
      resetMagnet();
      resetTilt();
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      resetMagnet();
      resetTilt();
    };
  }, []);

  return null;
}
