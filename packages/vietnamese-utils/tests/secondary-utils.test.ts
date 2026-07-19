import { expect, it } from "vitest";
import { createVietnameseSlug } from "../src/create-slug";
import { removeVietnameseDiacritics } from "../src/remove-diacritics";

it("removes Vietnamese diacritics", () =>
  expect(removeVietnameseDiacritics("Tiếng Việt Đẹp")).toBe("Tieng Viet Dep"));
it("creates a Vietnamese slug", () =>
  expect(createVietnameseSlug(" Công cụ Việt! ")).toBe("cong-cu-viet"));
