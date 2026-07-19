import { expect, it } from "vitest";
import { createVietnameseSlug } from "../src/create-slug";
import { removeVietnameseDiacritics } from "../src/remove-diacritics";
import { changeVietnameseCase } from "../src/change-case";

it("removes Vietnamese diacritics", () =>
  expect(removeVietnameseDiacritics("Tiếng Việt Đẹp")).toBe("Tieng Viet Dep"));
it("creates a Vietnamese slug", () =>
  expect(createVietnameseSlug(" Công cụ Việt! ")).toBe("cong-cu-viet"));
it("supports diacritic and slug options", () => {
  expect(removeVietnameseDiacritics("Đẹp", { convertD: false })).toBe("Đep");
  expect(
    createVietnameseSlug("Công cụ rất dài", {
      separator: "_",
      lowercase: false,
      maxLength: 8,
    }),
  ).toBe("Cong_cu");
});
it("changes Vietnamese case without changing punctuation", () => {
  expect(changeVietnameseCase("xin CHÀO! bạn", "lowercase")).toBe(
    "xin chào! bạn",
  );
  expect(changeVietnameseCase("xin chào", "uppercase")).toBe("XIN CHÀO");
  expect(changeVietnameseCase("xin chào. bạn khỏe?", "sentence")).toBe(
    "Xin chào. Bạn khỏe?",
  );
  expect(changeVietnameseCase("xin chào việt nam", "title")).toBe(
    "Xin Chào Việt Nam",
  );
  expect(changeVietnameseCase("ĐÂY LÀ MỘT CÂU.", "sentence")).toBe(
    "Đây là một câu.",
  );
  expect(changeVietnameseCase("ĐẶNG THÁI SƠN", "title")).toBe("Đặng Thái Sơn");
  expect(changeVietnameseCase("Xin Chào", "toggle")).toBe("xIN cHÀO");
});
