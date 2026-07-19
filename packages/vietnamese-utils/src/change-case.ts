export type TextCaseMode =
  | "lowercase"
  | "uppercase"
  | "sentence"
  | "title"
  | "toggle";

export function changeVietnameseCase(
  value: string,
  mode: TextCaseMode,
): string {
  if (mode === "lowercase") return value.toLocaleLowerCase("vi");
  if (mode === "uppercase") return value.toLocaleUpperCase("vi");
  if (mode === "toggle")
    return Array.from(value, (character) => {
      const lower = character.toLocaleLowerCase("vi");
      const upper = character.toLocaleUpperCase("vi");
      return character === lower && character !== upper ? upper : lower;
    }).join("");
  const lowerValue = value.toLocaleLowerCase("vi");
  if (mode === "title")
    return lowerValue.replace(
      /(^|[\s([{“‘-])(\p{L})/gu,
      (_, prefix: string, letter: string) =>
        prefix + letter.toLocaleUpperCase("vi"),
    );
  return lowerValue.replace(
    /(^|[.!?]+\s+)(\p{L})/gu,
    (_, prefix: string, letter: string) =>
      prefix + letter.toLocaleUpperCase("vi"),
  );
}
