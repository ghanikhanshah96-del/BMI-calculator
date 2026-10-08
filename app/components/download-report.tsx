"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { Check, ChevronDown, Copy, FileText, Image as ImageIcon, Loader2 } from "./icons";

export type ReportLine = { label: string; value: string };

export type CalculatorReport = {
  title: string;
  filename: string;
  lines: ReportLine[];
  summary?: string;
};

function buildTextReport(report: CalculatorReport) {
  const stamped = new Date().toLocaleString();
  const rows = [
    "FitnessCalculatorPro.com",
    report.title,
    `Generated: ${stamped}`,
    "",
    ...(report.summary ? [report.summary, ""] : []),
    ...report.lines.map((line) => `${line.label}: ${line.value}`),
    "",
    "Estimates only — not medical advice.",
    "https://fitnesscalculatorpro.com",
  ];
  return rows.join("\n");
}

async function copyText(report: CalculatorReport) {
  const text = buildTextReport(report);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

/** Draw a clean report image with canvas (avoids html2canvas + modern CSS color crashes). */
function renderReportCanvas(report: CalculatorReport): HTMLCanvasElement {
  const paddingX = 48;
  const paddingY = 40;
  const width = 900;
  const lineHeight = 28;
  const titleSize = 28;
  const bodySize = 16;
  const smallSize = 13;

  const rows: Array<{ text: string; size: number; weight: string; color: string; gap?: number }> = [
    { text: "FitnessCalculatorPro.com", size: titleSize, weight: "700", color: "#047857", gap: 8 },
    { text: report.title, size: 22, weight: "600", color: "#0f172a", gap: 6 },
    { text: `Generated: ${new Date().toLocaleString()}`, size: smallSize, weight: "400", color: "#64748b", gap: 18 },
  ];

  if (report.summary) {
    rows.push({ text: report.summary, size: bodySize, weight: "500", color: "#134e4a", gap: 16 });
  }

  for (const line of report.lines) {
    rows.push({
      text: `${line.label}: ${line.value}`,
      size: bodySize,
      weight: "400",
      color: "#1e293b",
      gap: 4,
    });
  }

  rows.push(
    { text: "", size: bodySize, weight: "400", color: "#1e293b", gap: 12 },
    { text: "Estimates only — not medical advice.", size: smallSize, weight: "400", color: "#64748b", gap: 4 },
    { text: "https://fitnesscalculatorpro.com", size: smallSize, weight: "400", color: "#047857", gap: 0 },
  );

  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) throw new Error("Canvas unavailable.");

  const wrap = (text: string, size: number, weight: string, maxWidth: number) => {
    measure.font = `${weight} ${size}px system-ui,Segoe UI,sans-serif`;
    if (!text) return [""];
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (measure.measureText(next).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [""];
  };

  const maxText = width - paddingX * 2;
  type Drawn = { text: string; size: number; weight: string; color: string };
  const drawn: Drawn[] = [];
  let contentHeight = paddingY;

  for (const row of rows) {
    const wrapped = wrap(row.text, row.size, row.weight, maxText);
    for (const part of wrapped) {
      drawn.push({ text: part, size: row.size, weight: row.weight, color: row.color });
      contentHeight += Math.max(lineHeight, row.size + 10);
    }
    contentHeight += row.gap ?? 0;
  }
  contentHeight += paddingY;

  const canvas = document.createElement("canvas");
  const scale = Math.min(2, window.devicePixelRatio || 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(contentHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable.");

  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, contentHeight);
  ctx.fillStyle = "#ecfdf5";
  ctx.fillRect(0, 0, width, 8);

  let y = paddingY + 8;
  for (const row of drawn) {
    ctx.font = `${row.weight} ${row.size}px system-ui,Segoe UI,sans-serif`;
    ctx.fillStyle = row.color;
    ctx.fillText(row.text, paddingX, y);
    y += Math.max(lineHeight, row.size + 10);
  }

  return canvas;
}

async function downloadPng(report: CalculatorReport) {
  const canvas = renderReportCanvas(report);
  const link = document.createElement("a");
  link.download = `${report.filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function downloadPdf(report: CalculatorReport) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(4, 120, 87);
  pdf.text("FitnessCalculatorPro.com", margin, y);
  y += 24;

  pdf.setFontSize(13);
  pdf.setTextColor(15, 23, 42);
  pdf.text(report.title, margin, y);
  y += 18;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
  y += 22;

  if (report.summary) {
    pdf.setFontSize(11);
    pdf.setTextColor(19, 78, 74);
    const summaryLines = pdf.splitTextToSize(report.summary, contentWidth);
    ensureSpace(summaryLines.length * 14 + 12);
    pdf.text(summaryLines, margin, y);
    y += summaryLines.length * 14 + 14;
  }

  pdf.setDrawColor(167, 243, 208);
  pdf.setLineWidth(1);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 16;

  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59);
  for (const line of report.lines) {
    const block = pdf.splitTextToSize(`${line.label}: ${line.value}`, contentWidth);
    ensureSpace(block.length * 15 + 4);
    pdf.text(block, margin, y);
    y += block.length * 15 + 4;
  }

  y += 10;
  ensureSpace(36);
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Estimates only — not medical advice.", margin, y);
  y += 14;
  pdf.setTextColor(4, 120, 87);
  pdf.text("https://fitnesscalculatorpro.com", margin, y);

  pdf.save(`${report.filename}.pdf`);
}

export function ResultReportActions({
  report,
}: {
  report: CalculatorReport | null | undefined;
  /** Kept for API compatibility; exports use structured report data, not DOM capture. */
  resultRef?: RefObject<HTMLDivElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"png" | "pdf" | "copy" | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!report) return null;

  const run = async (action: "png" | "pdf" | "copy") => {
    setError("");
    setBusy(action);
    try {
      if (action === "copy") {
        await copyText(report);
        setCopied(true);
      } else if (action === "png") {
        await downloadPng(report);
      } else {
        await downloadPdf(report);
      }
      setOpen(false);
    } catch {
      setError("Could not export the report. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div ref={rootRef} className="relative flex min-w-0 shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        data-tip="Download or copy your full result"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-200 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-950 hover:shadow-md hover:ring-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:translate-y-0"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" /> : null}
        <span className="truncate">Download report</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-slate-900/10 sm:right-0 sm:left-auto"
        >
          <button
            type="button"
            role="menuitem"
            disabled={busy !== null}
            onClick={() => void run("png")}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            <ImageIcon className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Image (PNG)
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={busy !== null}
            onClick={() => void run("pdf")}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            <FileText className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            PDF report
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={busy !== null}
            onClick={() => void run("copy")}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy text"}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="absolute top-full left-0 z-40 mt-12 max-w-[16rem] text-xs font-medium text-red-600 sm:right-0 sm:left-auto sm:text-right" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
