export interface TextStatistics {
  characters: number;
  charactersWithoutWhitespace: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingMinutes: number;
  topWords: Array<{ word: string; count: number }>;
}

export function getTextStatistics(
  value: string,
  ignoreCase = true,
): TextStatistics {
  const words = value.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];
  const counts = new Map<string, number>();
  for (const word of words) {
    const key = ignoreCase ? word.toLocaleLowerCase("vi") : word;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const graphemeCount = (text: string) =>
    [...new Intl.Segmenter("vi", { granularity: "grapheme" }).segment(text)]
      .length;
  const normalized = value.replace(/\r\n?/gu, "\n");
  return {
    characters: graphemeCount(value),
    charactersWithoutWhitespace: graphemeCount(value.replace(/\s/gu, "")),
    words: words.length,
    lines: value ? normalized.split("\n").length : 0,
    paragraphs: normalized.trim()
      ? normalized.trim().split(/\n[\t ]*\n/u).length
      : 0,
    readingMinutes: words.length
      ? Math.max(1, Math.ceil(words.length / 200))
      : 0,
    topWords: [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "vi"))
      .slice(0, 10)
      .map(([word, count]) => ({ word, count })),
  };
}

export interface NormalizeWhitespaceOptions {
  trim?: boolean;
  collapseSpaces?: boolean;
  removeBeforePunctuation?: boolean;
  addAfterPunctuation?: boolean;
  collapseBlankLines?: boolean;
  preserveLineBreaks?: boolean;
}
export function normalizeWhitespace(
  value: string,
  options: NormalizeWhitespaceOptions = {},
): string {
  const {
    trim = true,
    collapseSpaces = true,
    removeBeforePunctuation = true,
    addAfterPunctuation = false,
    collapseBlankLines = true,
    preserveLineBreaks = true,
  } = options;
  let result = value.replace(/\r\n?/gu, "\n");
  if (!preserveLineBreaks) result = result.replace(/\n+/gu, " ");
  if (collapseSpaces) result = result.replace(/[\t ]+/gu, " ");
  if (removeBeforePunctuation)
    result = result.replace(/[ \t]+([,;!?])/gu, "$1");
  if (addAfterPunctuation)
    result = result.replace(/([,;!?])(?![\s/])/gu, (match, _mark, offset) => {
      const before = result.slice(0, Number(offset));
      const after = result.slice(Number(offset) + match.length);
      const token = `${before.match(/\S*$/u)?.[0] ?? ""}${match}${after.match(/^\S*/u)?.[0] ?? ""}`;
      return /:\/\/|@/u.test(token) ? match : `${match} `;
    });
  if (collapseBlankLines)
    result = result.replace(/\n[ \t]*\n(?:[ \t]*\n)+/gu, "\n\n");
  return trim ? result.trim() : result;
}

export interface DeduplicateLinesOptions {
  caseSensitive?: boolean;
  trim?: boolean;
  ignoreBlank?: boolean;
  duplicatesOnly?: boolean;
}
export interface DeduplicateLinesResult {
  output: string;
  total: number;
  unique: number;
  removed: number;
}
export function deduplicateLines(
  value: string,
  options: DeduplicateLinesOptions = {},
): DeduplicateLinesResult {
  const {
    caseSensitive = true,
    trim = false,
    ignoreBlank = false,
    duplicatesOnly = false,
  } = options;
  const lines = value ? value.replace(/\r\n?/gu, "\n").split("\n") : [];
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const original of lines) {
    const display = trim ? original.trim() : original;
    if (ignoreBlank && !display) continue;
    const key = caseSensitive ? display : display.toLocaleLowerCase("vi");
    if (seen.has(key)) duplicates.push(display);
    else seen.set(key, display);
  }
  const output = duplicatesOnly ? duplicates : [...seen.values()];
  return {
    output: output.join("\n"),
    total: lines.length,
    unique: seen.size,
    removed: lines.length - seen.size,
  };
}

export type SortLinesMode =
  | "az"
  | "za"
  | "number-asc"
  | "number-desc"
  | "length-asc"
  | "length-desc"
  | "reverse"
  | "random";
export function sortLines(
  value: string,
  mode: SortLinesMode,
  options: { ignoreBlank?: boolean; trim?: boolean; ignoreCase?: boolean } = {},
): string {
  let lines = value
    .replace(/\r\n?/gu, "\n")
    .split("\n")
    .map((line) => (options.trim ? line.trim() : line));
  if (options.ignoreBlank) lines = lines.filter(Boolean);
  if (mode === "reverse") return lines.reverse().join("\n");
  if (mode === "random") {
    for (let index = lines.length - 1; index > 0; index--) {
      const next = Math.floor(Math.random() * (index + 1));
      [lines[index], lines[next]] = [lines[next]!, lines[index]!];
    }
    return lines.join("\n");
  }
  const collator = new Intl.Collator("vi", {
    sensitivity: options.ignoreCase ? "base" : "variant",
    numeric: false,
  });
  lines.sort((a, b) =>
    mode === "az"
      ? collator.compare(a, b)
      : mode === "za"
        ? collator.compare(b, a)
        : mode === "number-asc"
          ? Number(a) - Number(b)
          : mode === "number-desc"
            ? Number(b) - Number(a)
            : mode === "length-asc"
              ? a.length - b.length
              : b.length - a.length,
  );
  return lines.join("\n");
}

export interface LineDiff {
  type: "added" | "removed" | "unchanged";
  value: string;
}
export function diffLines(
  left: string,
  right: string,
  options: { ignoreCase?: boolean; trim?: boolean; ignoreBlank?: boolean } = {},
): LineDiff[] {
  const prepare = (text: string) =>
    (text.replace(/\r\n?/gu, "\n").split("\n") as string[])
      .filter((line, index) => text.length > 0 || index > 0)
      .filter((line) => !options.ignoreBlank || line.trim());
  const a = prepare(left),
    b = prepare(right),
    matrix = Array.from({ length: a.length + 1 }, () =>
      Array<number>(b.length + 1).fill(0),
    );
  const key = (line: string) => {
    const trimmed = options.trim ? line.trim() : line;
    return options.ignoreCase ? trimmed.toLocaleLowerCase("vi") : trimmed;
  };
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      matrix[i]![j] =
        key(a[i]!) === key(b[j]!)
          ? matrix[i + 1]![j + 1]! + 1
          : Math.max(matrix[i + 1]![j]!, matrix[i]![j + 1]!);
  const result: LineDiff[] = [];
  let i = 0,
    j = 0;
  while (i < a.length && j < b.length) {
    if (key(a[i]!) === key(b[j]!)) {
      result.push({ type: "unchanged", value: a[i]! });
      i++;
      j++;
    } else if (matrix[i + 1]![j]! >= matrix[i]![j + 1]!)
      result.push({ type: "removed", value: a[i++]! });
    else result.push({ type: "added", value: b[j++]! });
  }
  while (i < a.length) result.push({ type: "removed", value: a[i++]! });
  while (j < b.length) result.push({ type: "added", value: b[j++]! });
  return result;
}

export interface FindReplaceOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  regex?: boolean;
  replaceAll?: boolean;
}
export function findAndReplace(
  value: string,
  find: string,
  replacement: string,
  options: FindReplaceOptions = {},
): { output: string; count: number; error?: string } {
  if (!find) return { output: value, count: 0 };
  if (find.length > 1000)
    return {
      output: value,
      count: 0,
      error: "Mẫu tìm kiếm tối đa 1.000 ký tự.",
    };
  if (options.regex && /\([^)]*[+*][^)]*\)[+*{]|(?:\.\*|\.\+){2}/u.test(find))
    return {
      output: value,
      count: 0,
      error: "Biểu thức có cấu trúc lặp lồng nhau không an toàn.",
    };
  try {
    const source = options.regex
      ? find
      : find.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    const pattern = options.wholeWord ? `\\b(?:${source})\\b` : source;
    const allExpression = new RegExp(
      pattern,
      options.caseSensitive ? "gu" : "giu",
    );
    const matches = value.match(allExpression)?.length ?? 0;
    const expression =
      options.replaceAll === false
        ? new RegExp(pattern, options.caseSensitive ? "u" : "iu")
        : allExpression;
    const output = options.regex
      ? value.replace(expression, replacement)
      : value.replace(expression, () => replacement);
    return { output, count: matches };
  } catch {
    return {
      output: value,
      count: 0,
      error: "Biểu thức chính quy không hợp lệ.",
    };
  }
}

export function removeBlankLines(
  value: string,
  options: { collapse?: boolean; whitespaceIsBlank?: boolean } = {},
): string {
  const lines = value.replace(/\r\n?/gu, "\n").split("\n");
  const blank = (line: string) =>
    options.whitespaceIsBlank !== false ? line.trim() === "" : line === "";
  if (!options.collapse) return lines.filter((line) => !blank(line)).join("\n");
  return lines
    .map((line) => (blank(line) ? "" : line))
    .filter(
      (line, index) => !blank(line) || index === 0 || !blank(lines[index - 1]!),
    )
    .join("\n");
}
