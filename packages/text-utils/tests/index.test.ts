import { describe, expect, it, vi } from "vitest";
import {
  deduplicateLines,
  diffLines,
  findAndReplace,
  getTextStatistics,
  normalizeWhitespace,
  removeBlankLines,
  sortLines,
} from "../src";
describe("text utilities", () => {
  it("calculates Unicode text statistics", () => {
    const value = getTextStatistics("Việt Nam đẹp. Việt Nam!\n\nĐoạn hai");
    expect(value).toMatchObject({
      words: 7,
      lines: 3,
      paragraphs: 2,
      readingMinutes: 1,
    });
    expect(value.topWords).toEqual(
      expect.arrayContaining([{ word: "việt", count: 2 }]),
    );
    expect(getTextStatistics("")).toMatchObject({
      words: 0,
      lines: 0,
      paragraphs: 0,
      readingMinutes: 0,
    });
    expect(getTextStatistics("😀").characters).toBe(1);
    expect(getTextStatistics("👨‍👩‍👧‍👦").characters).toBe(1);
  });
  it("normalizes whitespace with options", () => {
    expect(
      normalizeWhitespace("  Xin   chào ,bạn\n\n\n nhé ", {
        addAfterPunctuation: true,
      }),
    ).toBe("Xin chào, bạn\n\n nhé");
    expect(
      normalizeWhitespace("a\n b", { preserveLineBreaks: false, trim: false }),
    ).toBe("a b");
    expect(
      normalizeWhitespace("https://example.com/a,b test@example.com", {
        addAfterPunctuation: true,
      }),
    ).toBe("https://example.com/a,b test@example.com");
    expect(
      normalizeWhitespace("Phiên bản 1.2.3", { addAfterPunctuation: true }),
    ).toBe("Phiên bản 1.2.3");
  });
  it("deduplicates while preserving first display value", () => {
    expect(
      deduplicateLines(" A \na\n\nb", {
        caseSensitive: false,
        trim: true,
        ignoreBlank: true,
      }),
    ).toEqual({ output: "A\nb", total: 4, unique: 2, removed: 2 });
    expect(deduplicateLines("a\na\nb", { duplicatesOnly: true }).output).toBe(
      "a",
    );
    expect(deduplicateLines("")).toEqual({
      output: "",
      total: 0,
      unique: 0,
      removed: 0,
    });
  });
  it("sorts all supported ways", () => {
    expect(sortLines("b\na", "az")).toBe("a\nb");
    expect(sortLines("b\na", "za")).toBe("b\na");
    expect(sortLines("10\n2", "number-asc")).toBe("2\n10");
    expect(sortLines("10\n2", "number-desc")).toBe("10\n2");
    expect(sortLines("aaaa\nb", "length-asc")).toBe("b\naaaa");
    expect(sortLines("a\nbbb", "length-desc")).toBe("bbb\na");
    expect(sortLines("a\nb", "reverse")).toBe("b\na");
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(sortLines("a\nb", "random")).toBe("b\na");
  });
  it("diffs lines with options", () => {
    expect(diffLines("A\nb", "a\nc", { ignoreCase: true })).toEqual([
      { type: "unchanged", value: "A" },
      { type: "removed", value: "b" },
      { type: "added", value: "c" },
    ]);
    expect(
      diffLines(" a \n", "a", { trim: true, ignoreBlank: true })[0]?.type,
    ).toBe("unchanged");
    expect(diffLines("", "")).toEqual([]);
    expect(diffLines("a\nb", "x\na\nb")).toEqual([
      { type: "added", value: "x" },
      { type: "unchanged", value: "a" },
      { type: "unchanged", value: "b" },
    ]);
  });
  it("finds and replaces safely", () => {
    expect(findAndReplace("a A", "a", "x")).toEqual({
      output: "x x",
      count: 2,
    });
    expect(
      findAndReplace("cat catalog", "cat", "x", { wholeWord: true }),
    ).toEqual({ output: "x catalog", count: 1 });
    expect(findAndReplace("abc", "[", "x", { regex: true }).error).toBeTruthy();
    expect(findAndReplace("abc", "", "x").count).toBe(0);
    expect(findAndReplace("abc", "x".repeat(1001), "x").error).toBeTruthy();
    expect(findAndReplace("a a", "a", "$&", { replaceAll: false })).toEqual({
      output: "$& a",
      count: 2,
    });
    expect(
      findAndReplace("a1 b2", "([a-z])(\\d)", "$2$1", { regex: true }),
    ).toEqual({ output: "1a 2b", count: 2 });
    expect(
      findAndReplace("aaaa", "(a+)+", "x", { regex: true }).error,
    ).toContain("không an toàn");
  });
  it("removes and collapses blank lines", () => {
    expect(removeBlankLines("a\n \n\nb")).toBe("a\nb");
    expect(removeBlankLines("a\n\n\nb", { collapse: true })).toBe("a\n\nb");
    expect(removeBlankLines("a\n \nb", { whitespaceIsBlank: false })).toBe(
      "a\n \nb",
    );
    expect(removeBlankLines(" \r\n\t\r\n", { collapse: true })).toBe("");
  });
});
