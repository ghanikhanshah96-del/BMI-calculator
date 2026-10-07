import type { IconComponent } from "./icons";
import type { ReactNode } from "react";
import HeroBackdrop from "./hero-backdrop";

/**
 * Page title block + tools-page-style photo backdrop.
 * Parent must be `relative isolate` so the tall backdrop fades behind the page content
 * (same pattern as calculator tool pages).
 */
export default function PageHero({
  image,
  imageAlt,
  title,
  description,
  children,
}: {
  image: string;
  imageAlt: string;
  /** Kept for call-site compatibility; not rendered. */
  eyebrow?: string;
  icon?: IconComponent;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[46rem]" aria-hidden="true">
        <HeroBackdrop image={image} imageAlt={imageAlt} />
      </div>
      <div className="hero-inner relative z-10 text-left">
        <div className="mr-auto w-full max-w-none text-left">
          {children}
          <h1 className="hero-title">{title}</h1>
          {description ? <div className="hero-copy">{description}</div> : null}
        </div>
      </div>
    </>
  );
}
