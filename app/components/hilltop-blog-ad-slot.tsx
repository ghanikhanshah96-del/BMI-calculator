"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const SLOT_ID = "hilltop-blog-ad-slot-mount";

function relocateBlogAd(mount: HTMLElement) {
  if (mount.querySelector('iframe[src*="fond-appointment.com"]')) return;

  document.querySelectorAll("iframe").forEach((iframe) => {
    const src = iframe.getAttribute("src") || iframe.src || "";
    if (!src.includes("fond-appointment.com")) return;
    if (mount.contains(iframe)) return;
    if (iframe.closest("#hilltop-ad-slot-mount, .hilltop-ad-band")) return;

    const width = iframe.offsetWidth || Number(iframe.getAttribute("width")) || 0;
    const height = iframe.offsetHeight || Number(iframe.getAttribute("height")) || 0;
    if ((width > 0 && width < 50) || (height > 0 && height < 50)) return;

    let node = iframe as HTMLElement;
    while (node.parentElement && node.parentElement !== document.body) {
      node = node.parentElement;
    }
    if (node.tagName === "SCRIPT") {
      if (iframe.parentElement !== mount) mount.appendChild(iframe);
      return;
    }
    if (node.parentElement === document.body) {
      mount.appendChild(node);
      return;
    }
    if (iframe.parentElement !== mount) mount.appendChild(iframe);
  });
}

export default function HilltopBlogAdSlot() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const collect = () => relocateBlogAd(mount);
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
    <aside className="hilltop-blog-ad" aria-label="Advertisement">
      <p className="hilltop-ad-label">Advertisement</p>
      <div id={SLOT_ID} ref={mountRef} className="hilltop-ad-frame">
        <Script id="hilltopads-blog-zone" strategy="afterInteractive">
          {`
            (function(hvi){
            var d = document,
                s = d.createElement('script'),
                l = d.currentScript || d.scripts[d.scripts.length - 1];
            s.settings = hvi || {};
            s.src = "//fond-appointment.com/b/X.V/shdsGHl_0PYgW/cP/TebmQ9/ueZZUtlbkVP/T/cJ2KNGTIMQ2/NnjnE_tlNTzXYR1/MyzyYd2KNpQC";
            s.async = true;
            s.referrerPolicy = 'no-referrer-when-downgrade';
            l.parentNode.insertBefore(s, l);
            })({})
          `}
        </Script>
      </div>
    </aside>
  );
}
