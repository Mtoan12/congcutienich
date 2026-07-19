import { afterEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "./copy-to-clipboard";
describe("copyToClipboard", () => {
  afterEach(() => vi.restoreAllMocks());
  it("uses the Clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    expect(await copyToClipboard("abc")).toBe(true);
    expect(writeText).toHaveBeenCalledWith("abc");
  });
  it("falls back when Clipboard API fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("no")) },
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    });
    expect(await copyToClipboard("abc")).toBe(true);
    expect(document.querySelector("textarea")).toBeNull();
  });
  it("returns false when both methods fail", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => {
        throw new Error("no");
      }),
    });
    expect(await copyToClipboard("abc")).toBe(false);
  });
});
