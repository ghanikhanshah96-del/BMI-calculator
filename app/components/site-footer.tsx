import { Activity, Apple, HeartPulse, Mail, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";

const toolLinks = [
  { href: "/#tools", label: "BMI Calculator" },
  { href: "/#tools", label: "TDEE Calculator" },
  { href: "/#tools", label: "Macro Planner" },
  { href: "/#tools", label: "Body Fat Calculator" },
];

const resourceLinks = [
  { href: "/blog#bmi-starting-point", label: "BMI Guide" },
  { href: "/blog#calorie-target", label: "Calorie Planning" },
  { href: "/blog#progress-signals", label: "Progress Tracking" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.75fr_0.75fr_0.75fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-900/25">
                <Scale className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                  BMI Health
                </span>
                <span className="text-xl font-black">BMI Wellness Pro</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Free BMI, calorie, macro, body composition, pregnancy, and ovulation calculators for education and everyday wellness planning.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[HeartPulse, Activity, Apple, ShieldCheck].map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 text-emerald-300"
                >
                  <Icon className="h-5 w-5" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              Tools
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              {toolLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              Resources
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              {resourceLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              Company
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <Link href="/blog" className="hover:text-white">Blog</Link>
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
              <span className="inline-flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4" />
                Support coming soon
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-lg bg-white/6 p-4 text-sm leading-6 text-slate-300">
          BMI Wellness Pro provides educational estimates only. Calculator results are not medical advice, diagnosis, or treatment. Speak with a qualified health professional for personal medical decisions.
        </div>

        <div className="mt-8 flex flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>Copyright 2026 BMI Wellness Pro. All rights reserved.</p>
          <p>Built for simple, privacy-conscious health planning.</p>
        </div>
      </div>
    </footer>
  );
}
