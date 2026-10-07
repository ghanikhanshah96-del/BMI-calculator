import Image from "next/image";

/** Same photo treatment as the home hero: image on the right, soft mint wash on the left. */
export default function HeroBackdrop({
  image = "/images/hero-bg.jpg",
  imageAlt = "",
}: {
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="hero-photo-bottom pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="hero-photo-left absolute inset-y-0 right-0 w-full md:w-[72%] lg:w-[62%]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-[#f6fbf8] from-0% via-[#f6fbf8]/75 via-42% to-transparent" />
      <div className="ambient-orb absolute -left-40 -top-10 h-128 w-lg rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.35),transparent_65%)]" />
    </div>
  );
}
