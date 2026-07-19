import {
  InvalidVietnameseNumberError,
  normalizeVietnameseNumberInput,
} from "@viettools/vietnamese-utils";

export function validateNumberInput(
  value: string,
): { success: true } | { success: false; error: string } {
  try {
    normalizeVietnameseNumberInput(value);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof InvalidVietnameseNumberError
          ? error.message
          : "Không thể chuyển đổi giá trị này.",
    };
  }
}
