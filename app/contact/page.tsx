import { Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "../components/page-hero";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact FitnessCalculatorPro.com with questions about our BMI, TDEE, macro, body fat, pregnancy, and ovulation calculators.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | FitnessCalculatorPro.com",
    description:
      "Send a message to the FitnessCalculatorPro.com team about our free health calculators.",
    url: "/contact",
    type: "website",
  },
};

const infoCards = [
  {
    icon: Clock,
    title: "Quick replies",
    text: "We typically respond within 1–2 business days.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Your message is only used to reply to you — never sold or shared.",
  },
  {
    icon: Mail,
    title: "Feedback welcome",
    text: "Ideas for new calculators or clearer guides are always appreciated.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="contact" />
      <PageHero
        image="/images/contact.jpg"
        imageAlt="Hands typing a message on a laptop"
        eyebrow="Contact"
        icon={MessageCircle}
        title="Get in touch"
        description="Questions about the calculators, feedback, or partnership ideas? Send a short message and we will reply by email."
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <ContactForm />
          </div>

          <aside className="grid gap-5">
            <div className="group relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl shadow-emerald-900/15 ring-1 ring-slate-900/5">
              <Image
                src="/images/overview-wellness.jpg"
                alt="Woman meditating at sunrise"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-emerald-950/85 via-emerald-900/20 to-transparent" />
              <p className="absolute inset-x-5 bottom-5 font-display text-xl leading-snug text-white">
                Small, steady steps add up to lasting health.
              </p>
            </div>

            {infoCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="spotlight group card-lift flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5"
              >
                <span className="icon-badge h-11 w-11 flex-none rounded-xl">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}

            <p className="px-1 text-sm text-slate-500">
              Looking for answers first? Browse the{" "}
              <Link href="/blog" className="content-link">calculator guides</Link>.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
