import { expect, test } from "vitest";

import { type Flag, parseFlag } from "../src/flag";

test("just the name with one dash -", () => {
  expect(parseFlag("-p")).toEqual({
    name: "p",
    type: "boolean",
    required: false,
    fallback: undefined,
  });
});

test("just the name with double dash --", () => {
  expect(parseFlag("--auto-pause")).toEqual({
    name: "auto-pause",
    type: "boolean",
    required: false,
    fallback: undefined,
  });
});

test("name with single dash - and fallback", () => {
  expect(parseFlag("-p=true")).toEqual({
    name: "p",
    type: "boolean",
    required: false,
    fallback: true,
  });
});

test("name with double dash -- and fallback", () => {
  expect(parseFlag("--auto-pause=true")).toEqual({
    name: "auto-pause",
    type: "boolean",
    required: false,
    fallback: true,
  });
});

test("name with single dash -, type and fallback", () => {
  expect(parseFlag("--p:number=123")).toEqual({
    name: "p",
    type: "number",
    required: false,
    fallback: 123,
  });
});

test("name with double dash --, type and fallback", () => {
  const flagStr = "--auto-pause:number=123";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    required: false,
    fallback: 123,
  } satisfies Flag<typeof flagStr>);
});

test("name single dash -, type and required", () => {
  const flagStr = "--p!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    type: "number",
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash --, type and required", () => {
  const flagStr = "--auto-pause!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});
