import type { IconComponent } from "./icons";
import type { ReactNode } from "react";
import HeroBackdrop from "./hero-backdrop";

export default function PageHero({
  eyebrow,
  icon: Icon,
  title,
  description,
  children,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  icon?: IconComponent;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="hero-shell">
      <HeroBackdrop />
      <div className="hero-inner">
        <div className="max-w-3xl">
          {children}
          <p className="hero-pill">
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {eyebrow}
          </p>
          <h1 className="hero-title">{title}</h1>
          {description ? <div className="hero-copy">{description}</div> : null}
        </div>
      </div>
    </section>
  );
}
