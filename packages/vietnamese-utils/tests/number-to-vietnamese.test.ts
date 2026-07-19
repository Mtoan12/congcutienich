import { describe, expect, it } from "vitest";
import {
  InvalidVietnameseNumberError,
  normalizeVietnameseNumberInput,
  numberToVietnameseWords,
} from "../src";

describe("numberToVietnameseWords", () => {
  it.each([
    ["0", "không"],
    ["1", "một"],
    ["5", "năm"],
  ])("reads basic digit %s", (input, expected) => {
    expect(numberToVietnameseWords(input)).toBe(expected);
  });

  it.each([
    ["10", "mười"],
    ["11", "mười một"],
    ["15", "mười lăm"],
    ["20", "hai mươi"],
    ["21", "hai mươi mốt"],
    ["24", "hai mươi tư"],
    ["25", "hai mươi lăm"],
    ["99", "chín mươi chín"],
  ])("reads tens %s", (input, expected) =>
    expect(numberToVietnameseWords(input)).toBe(expected),
  );

  it.each([
    ["100", "một trăm"],
    ["101", "một trăm linh một"],
    ["105", "một trăm linh năm"],
    ["110", "một trăm mười"],
    ["115", "một trăm mười lăm"],
    ["121", "một trăm hai mươi mốt"],
  ])("reads hundreds %s", (input, expected) =>
    expect(numberToVietnameseWords(input)).toBe(expected),
  );

  it.each([
    ["1000", "một nghìn"],
    ["1001", "một nghìn không trăm linh một"],
    ["1005", "một nghìn không trăm linh năm"],
    ["1010", "một nghìn không trăm mười"],
    ["1050", "một nghìn không trăm năm mươi"],
    ["1100", "một nghìn một trăm"],
    ["10000", "mười nghìn"],
    ["100000", "một trăm nghìn"],
  ])("reads thousands %s", (input, expected) =>
    expect(numberToVietnameseWords(input)).toBe(expected),
  );

  it("reads millions, billions and mixed values", () => {
    expect(numberToVietnameseWords("1000000")).toBe("một triệu");
    expect(numberToVietnameseWords("1000000000")).toBe("một tỷ");
    expect(numberToVietnameseWords("125430")).toBe(
      "một trăm hai mươi lăm nghìn bốn trăm ba mươi",
    );
  });

  it("supports negative, currency and capitalization options", () => {
    expect(numberToVietnameseWords("-125")).toBe("âm một trăm hai mươi lăm");
    expect(numberToVietnameseWords("-0")).toBe("không");
    expect(numberToVietnameseWords("125430", { currency: true })).toBe(
      "một trăm hai mươi lăm nghìn bốn trăm ba mươi đồng",
    );
    expect(numberToVietnameseWords("125", { capitalize: true })).toBe(
      "Một trăm hai mươi lăm",
    );
    expect(
      numberToVietnameseWords("125430", { currency: true, capitalize: true }),
    ).toBe("Một trăm hai mươi lăm nghìn bốn trăm ba mươi đồng");
  });

  it("can omit zero hundreds when requested", () => {
    expect(numberToVietnameseWords("1005", { zeroHundreds: false })).toBe(
      "một nghìn năm",
    );
  });

  it("supports very large values without precision loss", () => {
    expect(numberToVietnameseWords("1000000000000000000")).toBe("một tỷ tỷ");
    expect(numberToVietnameseWords(1000n)).toBe("một nghìn");
  });
});

describe("normalizeVietnameseNumberInput", () => {
  it.each(["125.430", "125,430", "125 430", "  +125430 "])(
    "normalizes %s",
    (input) => {
      expect(normalizeVietnameseNumberInput(input)).toBe("125430");
    },
  );
  it("normalizes leading zeros and signs", () => {
    expect(normalizeVietnameseNumberInput("-000125")).toBe("-125");
    expect(normalizeVietnameseNumberInput("-000")).toBe("0");
    expect(normalizeVietnameseNumberInput(125)).toBe("125");
  });
  it.each(["", "abc", "12.34", "1,23,456", "+", "1.000,25"])(
    "rejects invalid input %s",
    (input) => {
      expect(() => normalizeVietnameseNumberInput(input)).toThrow(
        InvalidVietnameseNumberError,
      );
    },
  );
  it("rejects unsafe numbers and oversized strings", () => {
    expect(() =>
      normalizeVietnameseNumberInput(Number.MAX_SAFE_INTEGER + 1),
    ).toThrow("số nguyên an toàn");
    expect(() => normalizeVietnameseNumberInput("1".repeat(67))).toThrow(
      "vượt quá giới hạn",
    );
  });
});
