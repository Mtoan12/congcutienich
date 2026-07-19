"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  changeVietnameseCase,
  createVietnameseSlug,
  numberToVietnameseWords,
  removeVietnameseDiacritics,
} from "@viettools/vietnamese-utils";
import {
  deduplicateLines,
  diffLines,
  findAndReplace,
  getTextStatistics,
  normalizeWhitespace,
  removeBlankLines,
  sortLines,
  type SortLinesMode,
} from "@viettools/text-utils";
import {
  decodeJwt,
  formatJson,
  jsonToTypeScript,
} from "@viettools/developer-utils";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { trackEvent } from "@/lib/analytics";

const TEXT_LIMIT = 1_000_000,
  JSON_LIMIT = 2_000_000,
  JWT_LIMIT = 100_000;
type Options = { mode: string; flag: boolean; second: boolean; third: boolean };
const DEFAULT_OPTIONS: Options = {
  mode: "default",
  flag: false,
  second: false,
  third: false,
};
export function ToolWorkbench({ toolId }: { toolId: string }) {
  const [input, setInput] = useState("");
  const [right, setRight] = useState("");
  const [find, setFind] = useState("");
  const [replacement, setReplacement] = useState("");
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );
  const limit = toolId.includes("json")
    ? JSON_LIMIT
    : toolId === "jwt-decoder"
      ? JWT_LIMIT
      : TEXT_LIMIT;
  const tooLarge = input.length > limit || right.length > TEXT_LIMIT;
  const result = useMemo((): {
    output: string;
    error?: string;
    extra?: React.ReactNode;
  } => {
    if (tooLarge)
      return {
        output: "",
        error: `Dữ liệu vượt giới hạn ${limit.toLocaleString("vi-VN")} ký tự.`,
      };
    if (toolId === "chuyen-so-thanh-chu") {
      try {
        return {
          output: input
            ? numberToVietnameseWords(input, {
                currency: options.flag,
                capitalize: options.second,
              })
            : "",
        };
      } catch (error) {
        return {
          output: "",
          error: error instanceof Error ? error.message : "Số không hợp lệ.",
        };
      }
    }
    if (toolId === "xoa-dau-tieng-viet")
      return {
        output: removeVietnameseDiacritics(input, { convertD: !options.flag }),
      };
    if (toolId === "tao-slug")
      return {
        output: createVietnameseSlug(input, {
          separator: options.mode === "underscore" ? "_" : "-",
          lowercase: !options.flag,
          ...(options.second ? { maxLength: 80 } : {}),
        }),
      };
    if (toolId === "chuyen-chu-hoa-thuong")
      return {
        output: changeVietnameseCase(
          input,
          (options.mode === "default"
            ? "lowercase"
            : options.mode) as "lowercase",
        ),
      };
    if (toolId === "dem-tu-ky-tu") {
      const stats = getTextStatistics(input, !options.flag);
      return {
        output: input,
        extra: (
          <div className="stats-grid" aria-live="polite">
            {[
              ["Ký tự Unicode", stats.characters],
              ["Không khoảng trắng", stats.charactersWithoutWhitespace],
              ["Từ", stats.words],
              ["Dòng", stats.lines],
              ["Đoạn", stats.paragraphs],
              ["Phút đọc", stats.readingMinutes],
            ].map(([label, value]) => (
              <div className="stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
            <div className="stat stat-wide">
              <strong>Top từ</strong>
              <span>
                {stats.topWords
                  .map((item) => `${item.word} (${item.count})`)
                  .join(", ") || "Chưa có dữ liệu"}
              </span>
            </div>
          </div>
        ),
      };
    }
    if (toolId === "chuan-hoa-khoang-trang")
      return {
        output: normalizeWhitespace(input, {
          addAfterPunctuation: options.flag,
          preserveLineBreaks: !options.second,
        }),
      };
    if (toolId === "xoa-dong-trung") {
      const value = deduplicateLines(input, {
        caseSensitive: !options.flag,
        trim: options.second,
        ignoreBlank: options.third,
        duplicatesOnly: options.mode === "duplicates",
      });
      return {
        output: value.output,
        extra: (
          <p className="tool-summary">
            Tổng {value.total} · Duy nhất {value.unique} · Đã xóa{" "}
            {value.removed}
          </p>
        ),
      };
    }
    if (toolId === "sap-xep-danh-sach")
      return {
        output: sortLines(
          input,
          (options.mode === "default" ? "az" : options.mode) as SortLinesMode,
          {
            ignoreBlank: options.flag,
            trim: options.second,
            ignoreCase: options.third,
          },
        ),
      };
    if (toolId === "so-sanh-van-ban") {
      const lines = diffLines(input, right, {
        ignoreCase: options.flag,
        trim: options.second,
        ignoreBlank: options.third,
      });
      const counts = {
        added: lines.filter((line) => line.type === "added").length,
        removed: lines.filter((line) => line.type === "removed").length,
        unchanged: lines.filter((line) => line.type === "unchanged").length,
      };
      return {
        output: lines
          .map(
            (line) =>
              `${line.type === "added" ? "+" : line.type === "removed" ? "−" : " "} ${line.value}`,
          )
          .join("\n"),
        extra: (
          <p className="tool-summary">
            Thêm {counts.added} · Xóa {counts.removed} · Không đổi{" "}
            {counts.unchanged}
          </p>
        ),
      };
    }
    if (toolId === "tim-va-thay-the")
      return findAndReplace(input, find, replacement, {
        caseSensitive: options.flag,
        wholeWord: options.second,
        regex: options.third,
        replaceAll: options.mode !== "first",
      });
    if (toolId === "xoa-dong-trong")
      return {
        output: removeBlankLines(input, {
          collapse: options.flag,
          whitespaceIsBlank: !options.second,
        }),
      };
    if (toolId === "json-formatter")
      return formatJson(input, {
        minify: options.mode === "minify",
        sortKeys: options.flag,
      });
    if (toolId === "json-sang-typescript")
      return jsonToTypeScript(input, {
        rootName: find || "Root",
        declaration: options.mode === "type" ? "type" : "interface",
        optional: options.flag,
        readonly: options.second,
        semicolon: !options.third,
      });
    if (toolId === "jwt-decoder") {
      if (!input) return { output: "" };
      const decoded = decodeJwt(input);
      if (decoded.error || !decoded.value)
        return { output: "", error: decoded.error ?? "JWT không hợp lệ." };
      return {
        output: `Header\n${JSON.stringify(decoded.value.header, null, 2)}\n\nPayload\n${JSON.stringify(decoded.value.payload, null, 2)}`,
        extra: (
          <p className="tool-summary">
            {decoded.value.expiresAt
              ? `Hết hạn: ${decoded.value.expiresAt.toLocaleString("vi-VN")} · ${decoded.value.expired ? "Đã hết hạn" : "Còn hiệu lực theo exp"}`
              : "Token không có exp"}
          </p>
        ),
      };
    }
    return { output: input };
  }, [find, input, limit, options, replacement, right, toolId, tooLarge]);
  const compare = toolId === "so-sanh-van-ban";
  const findReplace = toolId === "tim-va-thay-the";
  const jsonTs = toolId === "json-sang-typescript";
  async function copy() {
    const ok = await copyToClipboard(result.output);
    setNotice(ok ? "Đã sao chép." : "Không thể sao chép.");
    if (ok) trackEvent("result_copied", { tool: toolId });
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2500);
  }
  function download() {
    const blob = new Blob([result.output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "viettools-output.json";
    anchor.click();
    URL.revokeObjectURL(url);
    trackEvent("result_downloaded", { tool: toolId });
  }
  return (
    <section className="tool-shell" aria-label="Vùng xử lý">
      <div className={compare ? "compare-grid" : ""}>
        <label className="field">
          <span>
            {compare
              ? "Văn bản gốc"
              : toolId === "jwt-decoder"
                ? "JWT"
                : "Dữ liệu đầu vào"}
          </span>
          <textarea
            id={`${toolId}-input`}
            value={input}
            maxLength={limit + 1}
            aria-invalid={Boolean(result.error)}
            aria-describedby={result.error ? `${toolId}-error` : undefined}
            inputMode={toolId === "chuyen-so-thanh-chu" ? "numeric" : undefined}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Nhập nội dung tại đây…"
          />
        </label>
        {compare && (
          <label className="field">
            <span>Văn bản mới</span>
            <textarea
              value={right}
              maxLength={TEXT_LIMIT + 1}
              onChange={(event) => setRight(event.target.value)}
            />
          </label>
        )}
      </div>
      {(findReplace || jsonTs) && (
        <div className="inline-fields">
          <label className="field">
            <span>{jsonTs ? "Tên root type" : "Tìm"}</span>
            <input
              value={find}
              maxLength={1000}
              onChange={(event) => setFind(event.target.value)}
            />
          </label>
          {findReplace && (
            <label className="field">
              <span>Thay bằng</span>
              <input
                value={replacement}
                onChange={(event) => setReplacement(event.target.value)}
              />
            </label>
          )}
        </div>
      )}
      <ToolOptions toolId={toolId} options={options} setOptions={setOptions} />
      {result.error && (
        <p className="error" id={`${toolId}-error`} role="alert">
          {result.error}
        </p>
      )}
      {result.extra}
      {toolId !== "dem-tu-ky-tu" && (
        <label className="field">
          <span>Kết quả</span>
          <textarea
            className="output"
            readOnly
            value={result.output}
            aria-live="polite"
            placeholder="Kết quả sẽ hiển thị tại đây."
          />
        </label>
      )}
      <div className="tool-actions">
        <button
          className="button button-primary"
          type="button"
          onClick={copy}
          disabled={!result.output}
        >
          Sao chép
        </button>
        {toolId === "json-formatter" && (
          <button
            className="button button-secondary"
            type="button"
            disabled={!result.output}
            onClick={download}
          >
            Tải .json
          </button>
        )}
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            setInput("");
            setRight("");
            setFind("");
            setReplacement("");
            setOptions(DEFAULT_OPTIONS);
            setNotice("");
          }}
        >
          Xóa
        </button>
        <span aria-live="polite">{notice}</span>
      </div>
      {toolId === "jwt-decoder" && (
        <p className="warning" role="note">
          Công cụ chỉ giải mã nội dung JWT và không xác minh chữ ký.
        </p>
      )}
    </section>
  );
}

function ToolOptions({
  toolId,
  options,
  setOptions,
}: {
  toolId: string;
  options: Options;
  setOptions: (value: Options) => void;
}) {
  if (toolId === "chuyen-so-thanh-chu")
    return (
      <fieldset className="tool-options">
        <legend>Tùy chọn</legend>
        <label>
          <input
            type="checkbox"
            checked={options.flag}
            onChange={(event) =>
              setOptions({ ...options, flag: event.target.checked })
            }
          />
          Đọc dạng tiền Việt Nam
        </label>
        <label>
          <input
            type="checkbox"
            checked={options.second}
            onChange={(event) =>
              setOptions({ ...options, second: event.target.checked })
            }
          />
          Viết hoa chữ đầu
        </label>
      </fieldset>
    );
  const modes: Record<string, Array<[string, string]>> = {
    "tao-slug": [
      ["default", "Dấu gạch ngang"],
      ["underscore", "Dấu gạch dưới"],
    ],
    "chuyen-chu-hoa-thuong": [
      ["lowercase", "lowercase"],
      ["uppercase", "UPPERCASE"],
      ["sentence", "Sentence case"],
      ["title", "Title Case"],
      ["toggle", "Đảo hoa thường"],
    ],
    "xoa-dong-trung": [
      ["default", "Dòng duy nhất"],
      ["duplicates", "Chỉ dòng trùng"],
    ],
    "sap-xep-danh-sach": [
      ["az", "A → Z"],
      ["za", "Z → A"],
      ["number-asc", "Số tăng"],
      ["number-desc", "Số giảm"],
      ["length-asc", "Dài tăng"],
      ["length-desc", "Dài giảm"],
      ["reverse", "Đảo thứ tự"],
      ["random", "Trộn"],
    ],
    "json-formatter": [
      ["default", "Format"],
      ["minify", "Minify"],
    ],
    "json-sang-typescript": [
      ["interface", "Interface"],
      ["type", "Type"],
    ],
    "tim-va-thay-the": [
      ["default", "Thay tất cả"],
      ["first", "Chỉ thay kết quả đầu tiên"],
    ],
  };
  const flags: Record<string, [string, string, string]> = {
    "xoa-dau-tieng-viet": ["Giữ nguyên đ", "", ""],
    "tao-slug": ["Giữ chữ hoa", "Giới hạn 80 ký tự", ""],
    "dem-tu-ky-tu": ["Phân biệt hoa/thường", "", ""],
    "chuan-hoa-khoang-trang": ["Thêm space sau dấu câu", "Xóa xuống dòng", ""],
    "xoa-dong-trung": [
      "Không phân biệt hoa/thường",
      "Trim từng dòng",
      "Bỏ dòng trống",
    ],
    "sap-xep-danh-sach": [
      "Bỏ dòng trống",
      "Trim dòng",
      "Không phân biệt hoa/thường",
    ],
    "so-sanh-van-ban": [
      "Bỏ qua hoa/thường",
      "Bỏ khoảng trắng đầu/cuối",
      "Bỏ dòng trống",
    ],
    "tim-va-thay-the": ["Phân biệt hoa/thường", "Whole word", "Regex"],
    "xoa-dong-trong": [
      "Gộp dòng trống thành một",
      "Chỉ xem dòng rỗng là trống",
      "",
    ],
    "json-formatter": ["Sắp xếp key", "", ""],
    "json-sang-typescript": [
      "Thuộc tính optional",
      "Thuộc tính readonly",
      "Không dùng dấu chấm phẩy",
    ],
  };
  if (!modes[toolId] && !flags[toolId]) return null;
  return (
    <fieldset className="tool-options">
      <legend>Tùy chọn</legend>
      {modes[toolId] && (
        <select
          aria-label="Chế độ"
          value={options.mode}
          onChange={(event) =>
            setOptions({ ...options, mode: event.target.value })
          }
        >
          {modes[toolId]!.map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      )}
      {(flags[toolId] ?? []).map(
        (label, index) =>
          label && (
            <label key={label}>
              <input
                type="checkbox"
                checked={
                  index === 0
                    ? options.flag
                    : index === 1
                      ? options.second
                      : options.third
                }
                onChange={(event) =>
                  setOptions({
                    ...options,
                    [index === 0 ? "flag" : index === 1 ? "second" : "third"]:
                      event.target.checked,
                  })
                }
              />
              {label}
            </label>
          ),
      )}
    </fieldset>
  );
}
