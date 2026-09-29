import type { LucideIcon } from "lucide-react";
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
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950">
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
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-emerald-950/95 via-emerald-900/80 to-teal-800/40" />
      <div className="absolute -right-32 -top-32 -z-10 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.25),transparent_65%)]" />
      <div className="absolute -bottom-40 left-1/3 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(190,242,100,0.14),transparent_65%)]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          {children}
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50 ring-1 ring-white/20">
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {eyebrow}
          </p>
          <h1 className="mt-5 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {description ? (
            <div className="mt-4 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg">
              {description}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
