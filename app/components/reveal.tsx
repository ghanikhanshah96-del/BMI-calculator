import type { ElementType, ReactNode } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
