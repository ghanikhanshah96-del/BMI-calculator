"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const enable = () => root.classList.add("smooth-scroll");
    if (document.readyState === "complete") {
      const timer = window.setTimeout(enable, 1000);
      return () => window.clearTimeout(timer);
    }
    const onLoad = () => window.setTimeout(enable, 1000);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
