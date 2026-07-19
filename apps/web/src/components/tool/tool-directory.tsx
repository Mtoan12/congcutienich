"use client";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import {
  searchTools,
  toolCategories,
  type ToolCategory,
} from "@/lib/tool-registry";
import { trackEvent } from "@/lib/analytics";
export function ToolDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory | "all">("all");
  const results = useMemo(
    () => searchTools(query, category),
    [query, category],
  );
  return (
    <section className="section">
      <div className="directory-controls">
        <label className="field">
          <span>Tìm công cụ</span>
          <input
            type="search"
            value={query}
            placeholder="Ví dụ: xoa dau"
            onChange={(event) => {
              setQuery(event.target.value);
              trackEvent("tool_search_used", { tool: "directory" });
            }}
          />
        </label>
        <label className="field">
          <span>Danh mục</span>
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as ToolCategory | "all")
            }
          >
            <option value="all">Tất cả</option>
            {Object.entries(toolCategories).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p aria-live="polite">
        Tìm thấy <strong>{results.length}</strong> công cụ
      </p>
      {results.length ? (
        <div className="grid">
          {results.map((tool) => (
            <ToolCard tool={tool} key={tool.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Không tìm thấy công cụ</h2>
          <p>Thử từ khóa ngắn hơn hoặc chọn danh mục khác.</p>
        </div>
      )}
    </section>
  );
}
