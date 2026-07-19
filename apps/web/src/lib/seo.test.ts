import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { createToolMetadata } from "@/components/tool/tool-page";
import { availableTools } from "./tool-registry";

describe("tool SEO", () => {
  it("creates unique canonical metadata for every available tool", () => {
    const metadata = availableTools.map((tool) => createToolMetadata(tool.id));
    expect(new Set(metadata.map((item) => item.title)).size).toBe(14);
    expect(new Set(metadata.map((item) => item.description)).size).toBe(14);
    metadata.forEach((item, index) => {
      expect(item.alternates?.canonical).toBe(availableTools[index]!.path);
      expect(String(item.title).length).toBeLessThan(70);
    });
  });
  it("sitemap has every tool exactly once and robots allows the site", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.filter((url) => url.includes("/cong-cu/")).length).toBe(14);
    expect(robots().rules).toEqual(expect.objectContaining({ allow: "/" }));
  });
});
