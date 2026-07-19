export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [
          key,
          sortJsonKeys((value as Record<string, unknown>)[key]),
        ]),
    );
  return value;
}

export function formatJson(
  input: string,
  options: { minify?: boolean; sortKeys?: boolean } = {},
): { output: string; error?: string; position?: number } {
  try {
    let value: unknown = JSON.parse(input);
    if (options.sortKeys) value = sortJsonKeys(value);
    return { output: JSON.stringify(value, null, options.minify ? 0 : 2) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "JSON không hợp lệ";
    const match = message.match(/position (\d+)/u);
    return {
      output: "",
      error: message,
      ...(match ? { position: Number(match[1]) } : {}),
    };
  }
}

export interface TypeScriptOptions {
  rootName?: string;
  declaration?: "interface" | "type";
  optional?: boolean;
  readonly?: boolean;
  semicolon?: boolean;
  unknownInsteadOfAny?: boolean;
}
const identifier = /^[A-Za-z_$][\w$]*$/u;
function safeName(value: string): string {
  const cleaned = value
    .replace(/[^A-Za-z0-9_$]/gu, " ")
    .trim()
    .split(/\s+/u)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return identifier.test(cleaned)
    ? cleaned
    : `Root${cleaned.replace(/^\d+/u, "") || "Type"}`;
}
function infer(
  value: unknown,
  name: string,
  options: Required<TypeScriptOptions>,
  declarations: string[],
): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (!value.length)
      return `${options.unknownInsteadOfAny ? "unknown" : "any"}[]`;
    const types = [
      ...new Set(
        value.map((item) => infer(item, `${name}Item`, options, declarations)),
      ),
    ];
    return `(${types.join(" | ")})[]`;
  }
  if (typeof value !== "object") return typeof value;
  const fields = Object.entries(value as Record<string, unknown>).map(
    ([key, field]) =>
      `${options.readonly ? "  readonly" : " "} ${identifier.test(key) ? key : JSON.stringify(key)}${options.optional ? "?" : ""}: ${infer(field, safeName(key), options, declarations)}${options.semicolon ? ";" : ""}`,
  );
  const typeName = safeName(name);
  const body = fields.length ? `\n${fields.join("\n")}\n` : "";
  declarations.push(
    options.declaration === "interface"
      ? `export interface ${typeName} {${body}}`
      : `export type ${typeName} = {${body}}${options.semicolon ? ";" : ""}`,
  );
  return typeName;
}
export function jsonToTypeScript(
  input: string,
  inputOptions: TypeScriptOptions = {},
): { output: string; error?: string } {
  try {
    const value: unknown = JSON.parse(input);
    const options: Required<TypeScriptOptions> = {
      rootName: safeName(inputOptions.rootName || "Root"),
      declaration: inputOptions.declaration ?? "interface",
      optional: inputOptions.optional ?? false,
      readonly: inputOptions.readonly ?? false,
      semicolon: inputOptions.semicolon ?? true,
      unknownInsteadOfAny: inputOptions.unknownInsteadOfAny ?? true,
    };
    const declarations: string[] = [];
    const root = infer(value, options.rootName, options, declarations);
    if (root !== options.rootName)
      declarations.push(
        `export type ${options.rootName} = ${root}${options.semicolon ? ";" : ""}`,
      );
    return { output: [...new Set(declarations)].reverse().join("\n\n") };
  } catch {
    return { output: "", error: "JSON không hợp lệ." };
  }
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/gu, "+").replace(/_/gu, "/");
  if (typeof atob === "function")
    return decodeURIComponent(
      Array.from(
        atob(normalized),
        (character) =>
          `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`,
      ).join(""),
    );
  return Buffer.from(normalized, "base64").toString("utf8");
}
export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  issuedAt?: Date;
  expiresAt?: Date;
  expired?: boolean;
}
export function decodeJwt(
  token: string,
  now = new Date(),
): { value?: DecodedJwt; error?: string } {
  try {
    const parts = token.trim().split(".");
    if (
      parts.length !== 3 ||
      !parts[0] ||
      !parts[1] ||
      parts.some((part) => !/^[A-Za-z0-9_-]*$/u.test(part))
    )
      throw new Error();
    const header = JSON.parse(decodeBase64Url(parts[0]!)) as Record<
      string,
      unknown
    >;
    const payload = JSON.parse(decodeBase64Url(parts[1]!)) as Record<
      string,
      unknown
    >;
    const iat =
      typeof payload.iat === "number"
        ? new Date(payload.iat * 1000)
        : undefined;
    const exp =
      typeof payload.exp === "number"
        ? new Date(payload.exp * 1000)
        : undefined;
    return {
      value: {
        header,
        payload,
        ...(iat ? { issuedAt: iat } : {}),
        ...(exp
          ? { expiresAt: exp, expired: exp.getTime() <= now.getTime() }
          : {}),
      },
    };
  } catch {
    return { error: "JWT không hợp lệ. Token phải có đúng ba phần Base64URL." };
  }
}
