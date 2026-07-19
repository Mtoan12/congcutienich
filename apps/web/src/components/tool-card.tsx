import Link from "next/link";
import type { ToolDefinition } from "@/lib/tool-registry";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link className="card tool-card" href={tool.path}>
      <span className="icon-box">
        <span aria-hidden="true" className="tool-glyph">
          {tool.name.slice(0, 1)}
        </span>
      </span>
      <h3>{tool.name}</h3>
      <p>{tool.shortDescription}</p>
    </Link>
  );
}
