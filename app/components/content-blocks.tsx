import "./content-blocks.css";
import Link from "next/link";
import { Fragment } from "react";
import type { ContentBlock, ContentTable } from "../lib/content/blocks";
import { ArrowRight } from "./icons";

const INLINE_TOKEN = /(\*\*.+?\*\*|\[[^\]]+\]\([^)]+\))/g;

function plainLength(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").length;
}

/** Renders `**bold**` as <strong> and `[label](/path)` as a link; everything else is plain text. */
export function Inline({ text }: { text: string }) {
  return text.split(INLINE_TOKEN).map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
    if (part.startsWith("**")) {
      const inner = part.slice(2, -2);
      const link = inner.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <Link key={index} href={link[2]} className="inline-link">
            <strong>{link[1]}</strong>
          </Link>
        );
      }
      return <strong key={index}>{inner}</strong>;
    }
    const [, label, href] = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
    return (
      <Link key={index} href={href} className="inline-link">
        {label}
      </Link>
    );
  });
}

function DataTable({ table }: { table: ContentTable }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        {table.caption ? <caption>{table.caption}</caption> : null}
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={`${index}-${cell}`} scope="row">
                    <Inline text={cell} />
                  </th>
                ) : (
                  <td key={`${index}-${cell}`}>
                    <Inline text={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type FlowBlock = Extract<ContentBlock, { kind: "text" | "formula" | "list" }>;

const isFlow = (block: ContentBlock): block is FlowBlock =>
  block.kind === "text" || block.kind === "formula" || block.kind === "list";

/**
 * Short chips share one desktop row. Medium labels use 2 or 3 columns.
 * Seven-item short lists use a 4+3 band so they finish in two even rows.
 */
export function listMode(block: Extract<ContentBlock, { kind: "list" }>): "row" | "band" | "short" | "pair" | "stack" {
  if (block.ordered || block.items.length < 2) return "stack";
  const count = block.items.length;
  const longest = Math.max(...block.items.map(plainLength));
  if (longest > 72) return "stack";
  // Tiny chips (cycle days, etc.) share one desktop row.
  if (longest <= 28 && count <= 6) return "row";
  // Small sets such as muscle-gain points also share one desktop row.
  if (count <= 4 && longest <= 65) return "row";
  // 7 / 10 / 13 short points: two-or-more even rows instead of a tall 2-column stack.
  if (count >= 7 && count % 3 === 1) return "band";
  if (count === 2 || count % 3 === 1) return "pair";
  return "short";
}

function isFormulaLead(text: string) {
  const plain = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  const length = plainLength(plain);
  if (length <= 28) return true;
  return plain.endsWith(":") && length <= 52;
}

function FormulaRow({ label, formula }: { label?: string; formula: string }) {
  const lead = !label || isFormulaLead(label);
  return (
    <div className={lead ? "formula-row formula-row-lead" : "formula-row"}>
      {label ? (
        <p className="formula-row-text">
          <Inline text={label} />
        </p>
      ) : null}
      <p className="formula-row-eq">{formula}</p>
    </div>
  );
}

function renderFlow(blocks: FlowBlock[]) {
  const nodes = [];
  let index = 0;
  while (index < blocks.length) {
    const block = blocks[index];
    if (block.kind === "text") {
      const parts: string[] = [];
      while (index < blocks.length && blocks[index].kind === "text") {
        const text = blocks[index];
        if (text.kind === "text") parts.push(text.text);
        index += 1;
      }
      const nextIsFormula = blocks[index]?.kind === "formula";
      const last = parts.at(-1) ?? "";
      if (nextIsFormula && isFormulaLead(last)) {
        const before = parts.slice(0, -1);
        if (before.length) {
          nodes.push(
            <p key={`text-${index}`} className="prose-text">
              <Inline text={before.join(" ")} />
            </p>,
          );
        }
        const formula = blocks[index];
        if (formula.kind === "formula") {
          nodes.push(<FormulaRow key={`eq-${index}`} label={last} formula={formula.text} />);
        }
        index += 1;
        continue;
      }
      nodes.push(
        <p key={`text-${index}`} className="prose-text">
          <Inline text={parts.join(" ")} />
        </p>,
      );
      continue;
    }
    if (block.kind === "formula") {
      nodes.push(<FormulaRow key={`eq-${index}`} formula={block.text} />);
      index += 1;
      continue;
    }
    nodes.push(<FlowItem key={`item-${index}`} block={block} />);
    index += 1;
  }
  return nodes;
}

function FlowItem({ block }: { block: Exclude<FlowBlock, { kind: "formula" }> }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="prose-text">
          <Inline text={block.text} />
        </p>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={block.ordered ? "calc-list" : `dot-list dot-list-${listMode(block)}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>
              <Inline text={item} />
            </li>
          ))}
        </List>
      );
    }
  }
}

function WideBlock({ block, actionHref }: { block: Exclude<ContentBlock, FlowBlock>; actionHref: string }) {
  switch (block.kind) {
    case "tables":
      return (
        <div className={block.tables.length > 1 ? "data-table-grid data-table-grid-pair" : "data-table-grid"}>
          {block.tables.map((table) => (
            <DataTable key={table.head.join("|") + table.rows.length} table={table} />
          ))}
        </div>
      );
    case "cards":
      return (
        <div className="sub-cards">
          {block.items.map((card) => (
            <div key={card.title} className="sub-card">
              <h3 className="sub-card-title">
                <Inline text={card.title} />
              </h3>
              <Blocks blocks={card.blocks} actionHref={actionHref} className="mt-3" />
            </div>
          ))}
        </div>
      );
    case "terms":
      return (
        <dl className="term-grid">
          {block.items.map((item) => (
            <div key={item.term} className="term-item">
              <dt className="term-title">
                <Inline text={item.term} />
              </dt>
              <dd className="term-text">
                <Inline text={item.text} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "note":
      return (
        <p className="note-box">
          <Inline text={block.text} />
        </p>
      );
    case "action":
      return (
        <a href={actionHref} className="group btn-gradient action-link">
          <span className="min-w-0">
            <Inline text={block.text} />
          </span>
          <ArrowRight className="arrow-nudge flex-none" />
        </a>
      );
  }
}

/** Renders copy blocks in order. Text stays in one column; only short labels share a row. */
export function Blocks({
  blocks,
  actionHref = "#calculator",
  className = "",
}: {
  blocks: ContentBlock[];
  actionHref?: string;
  className?: string;
}) {
  const groups: (FlowBlock[] | Exclude<ContentBlock, FlowBlock>)[] = [];
  for (const block of blocks) {
    const last = groups.at(-1);
    if (isFlow(block)) {
      if (Array.isArray(last)) last.push(block);
      else groups.push([block]);
    } else {
      groups.push(block);
    }
  }

  return (
    <div className={`content-blocks ${className}`}>
      {groups.map((group, index) => {
        if (!Array.isArray(group)) return <WideBlock key={index} block={group} actionHref={actionHref} />;
        return <div key={index} className="flow-run">{renderFlow(group)}</div>;
      })}
    </div>
  );
}
