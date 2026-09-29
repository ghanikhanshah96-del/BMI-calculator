"use client";

import {
  Activity,
  Apple,
  ArrowRight,
  CalendarHeart,
  HeartPulse,
  Scale,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function CalculatorSkeleton() {
  return (
    <div className="grid min-h-136 animate-pulse gap-6 lg:min-h-104 lg:grid-cols-[1.1fr_0.9fr]" aria-hidden="true">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-100" />
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-emerald-100" />
            <div className="h-5 w-48 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-12 rounded-2xl bg-slate-100" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
        </div>
      </div>
      <div className="h-72 rounded-3xl bg-emerald-50" />
    </div>
  );
}

const BmiCalculator = dynamic(() => import("./components/bmi-calculator"), {
  loading: CalculatorSkeleton,
});
const TdeeCalculator = dynamic(() => import("./components/tdee-calculator"), {
  loading: CalculatorSkeleton,
});
const BodyFatCalculator = dynamic(() => import("./components/body-fat-calculator"), {
  loading: CalculatorSkeleton,
});
const MacroCalculator = dynamic(() => import("./components/macro-calculator"), {
  loading: CalculatorSkeleton,
});
const DueDateCalculator = dynamic(() => import("./components/due-date-calculator"), {
  loading: CalculatorSkeleton,
});
const OvulationCalculator = dynamic(() => import("./components/ovulation-calculator"), {
  loading: CalculatorSkeleton,
});

type ToolId = "bmi" | "tdee" | "body-fat" | "macro" | "pregnancy" | "ovulation";

const TOOL_IDS: ToolId[] = ["bmi", "tdee", "body-fat", "macro", "pregnancy", "ovulation"];

function isToolId(value: string): value is ToolId {
  return TOOL_IDS.includes(value as ToolId);
}

function parseToolFromHash(hash: string): ToolId | null {
  const value = hash.replace(/^#/, "");
  if (value === "tools") return "bmi";
  return isToolId(value) ? value : null;
}

const tools = [
  { id: "bmi", label: "BMI Calculator", short: "BMI", description: "Body mass index, category and healthy weight range.", icon: Scale },
  { id: "tdee", label: "TDEE Calculator", short: "TDEE", description: "Daily calorie burn from BMR and activity level.", icon: Activity },
  { id: "body-fat", label: "Body Fat %", short: "Body Fat", description: "U.S. Navy tape method with fitness categories.", icon: HeartPulse },
  { id: "macro", label: "Macro Planner", short: "Macros", description: "Protein, carb and fat targets for your goal.", icon: Apple },
  { id: "pregnancy", label: "Due Date", short: "Due Date", description: "Estimated due date and pregnancy milestones.", icon: CalendarHeart },
  { id: "ovulation", label: "Ovulation", short: "Ovulation", description: "Fertile window and next cycle predictions.", icon: Sparkles },
] as const;

export default function ToolsSection() {
  const [activeTool, setActiveTool] = useState<ToolId>("bmi");
  const [panelReady, setPanelReady] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const activeToolDetails = tools.find((tool) => tool.id === activeTool) ?? tools[0];
  const ActiveIcon = activeToolDetails.icon;
  const activeIndex = tools.findIndex((tool) => tool.id === activeTool);

  const activateTool = (
    toolId: ToolId,
    options?: { updateHash?: boolean; scroll?: boolean; behavior?: ScrollBehavior },
  ) => {
    const updateHash = options?.updateHash ?? true;
    const scroll = options?.scroll ?? true;
    const behavior = options?.behavior ?? "smooth";

    setActiveTool(toolId);
    setPanelReady(true);

    if (updateHash && typeof window !== "undefined") {
      const nextHash = `#${toolId}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
    }

    if (scroll && typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById("tools")?.scrollIntoView({ behavior, block: "start" });
      });
    }
  };

  useEffect(() => {
    const applyHash = (behavior: ScrollBehavior) => {
      const toolId = parseToolFromHash(window.location.hash);
      if (!toolId) return;
      activateTool(toolId, { updateHash: false, behavior });
    };

    // An animated scroll during page load ends LCP measurement before first paint.
    applyHash("instant");

    const onHashChange = () => applyHash("smooth");
    const onActivateTool = (event: Event) => {
      const detail = (event as CustomEvent<{ tool?: string }>).detail;
      const toolId = detail?.tool ? parseToolFromHash(detail.tool) : null;
      if (!toolId) return;
      activateTool(toolId, { updateHash: true, scroll: true });
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("bmi-activate-tool", onActivateTool);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("bmi-activate-tool", onActivateTool);
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || panelReady) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPanelReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, [panelReady]);

  useEffect(() => {
    const rail = railRef.current;
    const pill = rail?.querySelector<HTMLElement>(`[data-tool="${activeTool}"]`);
    if (!rail || !pill) return;
    rail.scrollTo({
      left: pill.offsetLeft - rail.clientWidth / 2 + pill.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeTool]);

  return (
    <>
      {/* Mobile picker: snap-scrolling pill rail */}
      <div className="sm:hidden">
        <div className="relative -mx-4">
          <div
            ref={railRef}
            role="group"
            aria-label="Choose a calculator"
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] mask-[linear-gradient(to_right,transparent,#000_1.25rem,#000_calc(100%-1.25rem),transparent)] [&::-webkit-scrollbar]:hidden"
          >
            {tools.map(({ id, short, icon: Icon }) => {
              const isActive = activeTool === id;
              return (
                <button
                  key={id}
                  type="button"
                  data-tool={id}
                  aria-controls="calculator-panel"
                  aria-pressed={isActive}
                  onClick={() => activateTool(id, { scroll: false })}
                  className={[
                    "flex min-h-11 flex-none snap-center items-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-300",
                    isActive
                      ? "bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white/30"
                      : "bg-white/10 text-emerald-50 ring-1 ring-white/15 active:bg-white/20",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {short}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15" aria-live="polite">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-900/30">
            <ActiveIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-200">
              Tool {activeIndex + 1} of {tools.length}
            </p>
            <p className="font-semibold text-white">{activeToolDetails.label}</p>
            <p className="mt-0.5 text-sm leading-5 text-emerald-50">{activeToolDetails.description}</p>
          </div>
        </div>
      </div>

      {/* Tablet/desktop picker: card grid */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ id, label, description, icon: Icon }) => {
          const isActive = activeTool === id;
          return (
            <button
              key={id}
              type="button"
              aria-controls="calculator-panel"
              aria-pressed={isActive}
              data-tilt
              onClick={() => activateTool(id)}
              className={[
                "spotlight spotlight-light group relative flex items-center gap-4 overflow-hidden rounded-2xl p-4 text-left transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300",
                isActive
                  ? "bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 ring-1 ring-white/30"
                  : "bg-white/8 text-white ring-1 ring-white/15 hover:-translate-y-1 hover:bg-white/[0.14] hover:shadow-xl hover:shadow-black/20 hover:ring-emerald-300/50",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-12 w-12 flex-none items-center justify-center rounded-xl transition duration-500 ease-out group-hover:-rotate-6",
                  isActive
                    ? "bg-white text-emerald-700 shadow-lg"
                    : "bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-900/30",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{label}</span>
                <span className={`mt-0.5 block text-sm leading-5 ${isActive ? "text-white" : "text-emerald-50/90"}`}>
                  {description}
                </span>
              </span>
              <span
                className={[
                  "flex h-8 w-8 flex-none items-center justify-center rounded-full transition duration-300 group-hover:translate-x-1",
                  isActive ? "bg-white/25" : "bg-white/10",
                ].join(" ")}
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <section
        ref={panelRef}
        id="calculator-panel"
        aria-label={`${activeToolDetails.label}`}
        className="mt-6 rounded-3xl bg-white shadow-2xl shadow-black/30 sm:mt-8"
      >
        <div className="hidden items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Calculator</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25">
            <ActiveIcon className="h-4 w-4" aria-hidden="true" />
            {activeToolDetails.label}
          </p>
        </div>
        <div key={activeTool} className="animate-fade-up p-4 sm:p-6 md:p-8">
          {!panelReady && <CalculatorSkeleton />}
          {panelReady && activeTool === "bmi" && <BmiCalculator />}
          {panelReady && activeTool === "tdee" && <TdeeCalculator />}
          {panelReady && activeTool === "body-fat" && <BodyFatCalculator />}
          {panelReady && activeTool === "macro" && <MacroCalculator />}
          {panelReady && activeTool === "pregnancy" && <DueDateCalculator />}
          {panelReady && activeTool === "ovulation" && <OvulationCalculator />}
        </div>
      </section>
    </>
  );
}
