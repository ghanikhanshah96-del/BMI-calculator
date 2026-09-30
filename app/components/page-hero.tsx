import type { IconComponent } from "./icons";
import Image from "next/image";
import type { ReactNode } from "react";

export default function PageHero({
  image,
  imageAlt,
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
      <Image
        src={image}
        alt={imageAlt}
        fill
        fetchPriority="high"
        loading="eager"
        quality={45}
        sizes="100vw"
        className="-z-20 object-cover opacity-80"
      />
      <div className="hero-overlay" />
      <div className="hero-glow-teal" />
      <div className="hero-glow-lime" />

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
