export interface RemoveVietnameseDiacriticsOptions {
  convertD?: boolean;
}

export function removeVietnameseDiacritics(
  value: string,
  { convertD = true }: RemoveVietnameseDiacriticsOptions = {},
): string {
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
  return convertD
    ? normalized.replace(/đ/gu, "d").replace(/Đ/gu, "D")
    : normalized;
}
