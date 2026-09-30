"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { legacyHashToSlug } from "../lib/tool-nav";

/** Sends old `/#bmi`-style links to the dedicated tool pages. */
export default function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirect = () => {
      const slug = legacyHashToSlug[window.location.hash.replace(/^#/, "")];
      if (slug) router.replace(`/${slug}`);
    };
    redirect();
    window.addEventListener("hashchange", redirect);
    return () => window.removeEventListener("hashchange", redirect);
  }, [router]);

  return null;
}
