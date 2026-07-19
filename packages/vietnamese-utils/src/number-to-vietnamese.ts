export interface NumberToVietnameseOptions {
  currency?: boolean;
  capitalize?: boolean;
  decimalMode?: "digit-by-digit" | "number";
  zeroHundreds?: boolean;
}

export class InvalidVietnameseNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidVietnameseNumberError";
  }
}

const DIGIT_WORDS = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
] as const;
const MAX_DIGITS = 66;

function invalid(
  message = "Giá trị không hợp lệ. Vui lòng chỉ nhập số.",
): never {
  throw new InvalidVietnameseNumberError(message);
}

/** Normalizes a signed integer while preserving every digit. */
export function normalizeVietnameseNumberInput(
  input: string | number | bigint,
): string {
  if (typeof input === "number") {
    if (!Number.isSafeInteger(input)) {
      return invalid("Giá trị dạng number phải là số nguyên an toàn.");
    }
  }

  let raw = String(input).trim();
  if (!raw) return invalid("Vui lòng nhập một số.");

  let sign = "";
  if (raw[0] === "+" || raw[0] === "-") {
    sign = raw[0] === "-" ? "-" : "";
    raw = raw.slice(1).trim();
  }
  if (!raw || /[^\d.,\s]/u.test(raw)) return invalid();

  const separators = raw.match(/[.,\s]+/gu);
  if (separators) {
    const groups = raw.split(/[.,\s]+/u);
    if (
      groups.some((group) => group.length === 0) ||
      groups[0]!.length > 3 ||
      groups[0]!.length === 0 ||
      groups.slice(1).some((group) => group.length !== 3)
    ) {
      return invalid("Dấu phân tách hàng nghìn không hợp lệ.");
    }
  }

  const digits = raw.replace(/[.,\s]/gu, "");
  if (!/^\d+$/u.test(digits)) return invalid();
  const normalizedDigits = digits.replace(/^0+(?=\d)/u, "");
  if (normalizedDigits.length > MAX_DIGITS) {
    return invalid("Số bạn nhập vượt quá giới hạn được hỗ trợ.");
  }
  return normalizedDigits === "0" ? "0" : `${sign}${normalizedDigits}`;
}

function readUnit(digit: number, tens: number): string {
  if (digit === 1 && tens > 1) return "mốt";
  if (digit === 4 && tens > 1) return "tư";
  if (digit === 5 && tens > 0) return "lăm";
  return DIGIT_WORDS[digit]!;
}

function readThreeDigits(group: string, forceHundreds: boolean): string {
  const padded = group.padStart(3, "0");
  const hundreds = Number.parseInt(padded[0]!, 10);
  const tens = Number.parseInt(padded[1]!, 10);
  const units = Number.parseInt(padded[2]!, 10);
  const words: string[] = [];

  if (hundreds > 0) words.push(DIGIT_WORDS[hundreds]!, "trăm");
  else if (forceHundreds && (tens > 0 || units > 0))
    words.push("không", "trăm");

  if (tens > 1) words.push(DIGIT_WORDS[tens]!, "mươi");
  else if (tens === 1) words.push("mười");
  else if (units > 0 && (hundreds > 0 || forceHundreds)) words.push("linh");

  if (units > 0) words.push(readUnit(units, tens));
  return words.join(" ");
}

/** Builds arbitrarily large group names following the nghìn/triệu/tỷ cycle. */
function getGroupUnit(index: number): string {
  if (index === 0) return "";
  const remainder = index % 3;
  const prefix = remainder === 1 ? "nghìn" : remainder === 2 ? "triệu" : "";
  const billions = Math.floor(index / 3);
  return [prefix, ...Array.from({ length: billions }, () => "tỷ")]
    .filter(Boolean)
    .join(" ");
}

export function numberToVietnameseWords(
  input: string | number | bigint,
  options: NumberToVietnameseOptions = {},
): string {
  const normalized = normalizeVietnameseNumberInput(input);
  const negative = normalized.startsWith("-");
  const digits = negative ? normalized.slice(1) : normalized;
  let result: string;

  if (digits === "0") {
    result = DIGIT_WORDS[0];
  } else {
    const groups: string[] = [];
    for (let end = digits.length; end > 0; end -= 3) {
      groups.unshift(digits.slice(Math.max(0, end - 3), end));
    }
    const words: string[] = [];
    groups.forEach((group, position) => {
      if (/^0+$/u.test(group)) return;
      const groupIndex = groups.length - position - 1;
      const hasHigherValue = words.length > 0;
      const forceHundreds =
        hasHigherValue && group.length === 3 && options.zeroHundreds !== false;
      words.push(readThreeDigits(group, forceHundreds));
      const unit = getGroupUnit(groupIndex);
      if (unit) words.push(unit);
    });
    result = words.join(" ");
  }

  if (negative && digits !== "0") result = `âm ${result}`;
  if (options.currency) result = `${result} đồng`;
  if (options.capitalize)
    result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}
