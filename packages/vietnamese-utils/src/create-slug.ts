import { removeVietnameseDiacritics } from "./remove-diacritics";

/** Reserved for Phase 2. */
export function createVietnameseSlug(value: string): string {
  return removeVietnameseDiacritics(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}
