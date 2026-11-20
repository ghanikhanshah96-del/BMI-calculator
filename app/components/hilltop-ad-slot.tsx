"use client";

import { useEffect, useRef } from "react";

const SLOT_MOUNT_ID = "hilltop-ad-slot-mount";

function isHilltopIframe(iframe: HTMLIFrameElement) {
  const src = iframe.getAttribute("src") || iframe.src || "";
  return src.includes("fond-appointment.com");
}

function bodyWrapper(el: Element): HTMLElement | null {
  let node = el as HTMLElement;
  while (node.parentElement && node.parentElement !== document.body) {
    node = node.parentElement;
  }
  if (node.parentElement !== document.body) return null;
  if (node.id === SLOT_MOUNT_ID || node.closest(".hilltop-ad-band")) return null;
  if (node.tagName === "SCRIPT") return null;
  return node;
}

function relocateHilltopAds(mount: HTMLElement) {
  document.querySelectorAll("iframe").forEach((iframe) => {
    if (!isHilltopIframe(iframe)) return;
    if (mount.contains(iframe)) return;

    const width = iframe.offsetWidth || Number(iframe.getAttribute("width")) || 0;
    const height = iframe.offsetHeight || Number(iframe.getAttribute("height")) || 0;
    if ((width > 0 && width < 50) || (height > 0 && height < 50)) return;

    const wrapper = bodyWrapper(iframe);
    if (wrapper) {
      mount.appendChild(wrapper);
      return;
    }

    if (iframe.parentElement !== mount) {
      mount.appendChild(iframe);
    }
  });
}

export default function HilltopAdSlot() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const collect = () => relocateHilltopAds(mount);
    collect();

    const observer = new MutationObserver(collect);
    observer.observe(document.body, { childList: true, subtree: true });

    const interval = window.setInterval(collect, 800);
    const stop = window.setTimeout(() => window.clearInterval(interval), 15000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, []);

  return (
    <aside className="hilltop-ad-band" aria-label="Advertisement">
      <div className="site-container">
        <p className="hilltop-ad-label">Advertisement</p>
        <div id={SLOT_MOUNT_ID} ref={mountRef} className="hilltop-ad-frame" />
      </div>
    </aside>
  );
}
