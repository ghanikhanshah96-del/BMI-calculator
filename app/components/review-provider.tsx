"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { shouldAskForReview } from "../lib/reviews";
import { ReviewPrompt } from "./review-prompt";
export default function ReviewProvider() {
  const [tool, setTool] = useState<string | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const prompt = (event: Event) => {
      clearTimeout(timer);
      if (shouldAskForReview())
        timer = setTimeout(() => {
          if (shouldAskForReview() && !document.querySelector("dialog[open]"))
            setTool(
              (event as CustomEvent<string>).detail || "Fitness calculator",
            );
        }, 900);
    };
    window.addEventListener("calculator-report-downloaded", prompt);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("calculator-report-downloaded", prompt);
    };
  }, [pathname]);
  return tool && !pathname.startsWith("/admin") ? (
    <ReviewPrompt toolName={tool} onClose={() => setTool(null)} />
  ) : null;
}
