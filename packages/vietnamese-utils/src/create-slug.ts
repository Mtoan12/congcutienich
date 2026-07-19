import { removeVietnameseDiacritics } from "./remove-diacritics";

export interface CreateSlugOptions {
  separator?: "-" | "_";
  lowercase?: boolean;
  maxLength?: number;
}

export function createVietnameseSlug(
  value: string,
  { separator = "-", lowercase = true, maxLength }: CreateSlugOptions = {},
): string {
  let result = removeVietnameseDiacritics(value);
  if (lowercase) result = result.toLowerCase();
  result = result
    .trim()
    .replace(/[^a-zA-Z0-9]+/gu, separator)
    .replace(new RegExp(`${separator === "-" ? "-" : "_"}+`, "gu"), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "gu"), "");
  if (maxLength && maxLength > 0) {
    result = result
      .slice(0, maxLength)
      .replace(new RegExp(`${separator}$`, "u"), "");
  }
  return result;
}
