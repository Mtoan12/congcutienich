import { describe, expect, it } from "vitest";
import {
  availableTools,
  getTool,
  searchTools,
  toolContent,
  tools,
} from "./tool-registry";
describe("tool registry", () => {
  it("contains 14 unique available tools", () => {
    expect(availableTools).toHaveLength(14);
    expect(new Set(availableTools.map((tool) => tool.path)).size).toBe(14);
    expect(new Set(tools.map((tool) => tool.id)).size).toBe(tools.length);
    expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length);
    expect(
      availableTools.every((tool) => tool.path === `/cong-cu/${tool.id}`),
    ).toBe(true);
    expect(availableTools.every((tool) => toolContent[tool.id])).toBe(true);
    expect(
      availableTools.filter((tool) => tool.featured).length,
    ).toBeLessThanOrEqual(8);
  });
  it("searches without Vietnamese diacritics and filters categories", () => {
    expect(searchTools("xoa dau").map((tool) => tool.id)).toContain(
      "xoa-dau-tieng-viet",
    );
    expect(searchTools("json", "developer")).toHaveLength(2);
    expect(searchTools("json", "text")).toHaveLength(0);
  });
  it("gets tools and rejects unknown ids", () => {
    expect(getTool("jwt-decoder").name).toBe("JWT Decoder");
    expect(() => getTool("missing")).toThrow();
  });
});
