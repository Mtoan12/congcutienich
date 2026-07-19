import { describe, expect, it, vi } from "vitest";
import { decodeJwt, formatJson, jsonToTypeScript, sortJsonKeys } from "../src";
const encode = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
describe("developer utilities", () => {
  it("sorts object keys recursively without reordering arrays", () => {
    const input = { z: 1, a: [{ z: 2, a: 1 }] };
    const output = sortJsonKeys(input);
    expect(Object.keys(output as object)).toEqual(["a", "z"]);
    expect(input).toEqual({ z: 1, a: [{ z: 2, a: 1 }] });
  });
  it("formats, minifies and reports JSON errors", () => {
    expect(formatJson('{"b":1,"a":2}', { sortKeys: true }).output).toContain(
      '"a": 2',
    );
    expect(formatJson('{"a": 1}', { minify: true }).output).toBe('{"a":1}');
    expect(formatJson("{").error).toBeTruthy();
  });
  it("generates compilable TypeScript declarations", () => {
    const result = jsonToTypeScript(
      '{"user name":"An","age":1,"active":true,"meta":null,"items":[1,"x"]}',
      { rootName: "123 API root", optional: true, readonly: true },
    );
    expect(result.error).toBeUndefined();
    expect(result.output).toContain('"user name"?');
    expect(result.output).toContain("number | string");
    expect(
      jsonToTypeScript("[]", {
        declaration: "type",
        semicolon: false,
        unknownInsteadOfAny: true,
      }).output,
    ).toContain("unknown");
    expect(jsonToTypeScript("bad").error).toBeTruthy();
    expect(
      jsonToTypeScript('{"nested":{"ok":true}}', {
        declaration: "type",
        semicolon: false,
      }).output,
    ).toContain("export type Nested");
  });
  it("decodes JWT timestamps and errors", () => {
    const token = `${encode({ alg: "none" })}.${encode({ iat: 100, exp: 200 })}.x`;
    const decoded = decodeJwt(token, new Date(300_000));
    expect(decoded.value?.expired).toBe(true);
    expect(decoded.value?.issuedAt).toEqual(new Date(100_000));
    expect(decodeJwt("bad").error).toBeTruthy();
    expect(decodeJwt(`${encode({})}.${encode({})}.x.extra`).error).toBeTruthy();
    expect(decodeJwt(`${encode({})}.not+base64.x`).error).toBeTruthy();
    const withoutExp = decodeJwt(`${encode({})}.${encode({ sub: "1" })}.x`);
    expect(withoutExp.value?.expiresAt).toBeUndefined();
    vi.stubGlobal("atob", undefined);
    expect(decodeJwt(token).value?.payload.exp).toBe(200);
    vi.unstubAllGlobals();
    const future = decodeJwt(
      `${encode({ typ: "JWT" })}.${encode({ exp: 500, label: "Tiếng Việt" })}.x`,
      new Date(100_000),
    );
    expect(future.value?.expired).toBe(false);
    expect(future.value?.payload.label).toBe("Tiếng Việt");
    expect(
      decodeJwt(`${encode({ alg: "none" })}.${encode({ sub: "1" })}.`).value,
    ).toBeTruthy();
  });
});
