import Image from "next/image";

/** Same photo treatment as the home/tools hero: image on the right, soft mint wash for readable text. */
export default function HeroBackdrop({
  image = "/images/hero-bg.jpg",
  imageAlt = "",
}: {
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="hero-photo-bottom pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-photo-left absolute inset-y-0 right-0 w-full md:w-[72%] lg:w-[62%]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover object-center opacity-35"
        />
      </div>
      {/* Keep the reading column light so dark text stays fully legible */}
      <div className="absolute inset-0 bg-linear-to-r from-[#f6fbf8] from-0% via-[#f6fbf8]/95 via-45% to-[#f6fbf8]/55" />
      <div className="absolute inset-0 bg-linear-to-r from-[#f6fbf8]/90 from-0% via-transparent via-70% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-[#f6fbf8] via-[#f6fbf8]/90 to-transparent" />
      <div className="ambient-orb absolute -left-40 -top-10 h-128 w-lg rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.35),transparent_65%)]" />
    </div>
  );
}
