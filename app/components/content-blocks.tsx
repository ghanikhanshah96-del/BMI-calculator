import "./content-blocks.css";
import Link from "next/link";
import { Fragment } from "react";
import type { ContentBlock, ContentTable } from "../lib/content/blocks";
import { ArrowRight } from "./icons";

const INLINE_TOKEN = /(\*\*.+?\*\*|\[[^\]]+\]\([^)]+\))/g;

/** Renders `**bold**` as <strong> and `[label](/path)` as a link; everything else is plain text. */
export function Inline({ text }: { text: string }) {
  return text.split(INLINE_TOKEN).map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
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

const flowLength = (block: FlowBlock) => (block.kind === "list" ? block.items.join(" ").length : block.text.length);

/** Bullet lists of four or more short items render two-up in narrower containers. */
export function isShortList(block: Extract<ContentBlock, { kind: "list" }>): boolean {
  return !block.ordered && block.items.length >= 4 && block.items.every((item) => item.length <= 40);
}

/** Text runs at least this long split into two columns once their container is wide enough. */
const COLUMN_MIN_CHARS = 420;

function FlowItem({ block }: { block: FlowBlock }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="prose-text">
          <Inline text={block.text} />
        </p>
      );
    case "formula":
      return <p className="formula-chip text-black">{block.text}</p>;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={block.ordered ? "calc-list" : isShortList(block) ? "dot-list dot-list-short" : "dot-list"}>
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

/**
 * Renders copy blocks in order. Consecutive text, formula, and list blocks form a run; long runs flow
 * into two columns in wide containers so full-width sections never leave an empty right-hand side.
 */
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
        const long = group.reduce((sum, block) => sum + flowLength(block), 0) >= COLUMN_MIN_CHARS;
        return (
          <div key={index} className={long ? "flow-run flow-run-cols" : "flow-run"}>
            {group.map((block, blockIndex) => (
              <FlowItem key={blockIndex} block={block} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
