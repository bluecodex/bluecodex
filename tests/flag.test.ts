import { expect, test } from "vitest";

import { type Flag, parseFlag } from "../src/flag";

test("just the name with one dash -", () => {
  const flagStr = "-p";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: undefined,
    dash: "-",
  } satisfies Flag<typeof flagStr>);
});

test("just the name with double dash --", () => {
  const flagStr = "--auto-pause";

  expect(parseFlag(flagStr)).toEqual({
    dash: "--",
    name: "auto-pause",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("name with single dash - and fallback", () => {
  const flagStr = "-p=true";

  expect(parseFlag(flagStr)).toEqual({
    dash: "-",
    name: "p",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash -- and fallback", () => {
  const flagStr = "--auto-pause=true";

  expect(parseFlag(flagStr)).toEqual({
    dash: "--",
    name: "auto-pause",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies Flag<typeof flagStr>);
});

test("name with single dash -, type and fallback", () => {
  const flagStr = "--p:number=123";

  expect(parseFlag(flagStr)).toEqual({
    dash: "--",
    name: "p",
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash --, type and fallback", () => {
  const flagStr = "--auto-pause:number=123";

  expect(parseFlag(flagStr)).toEqual({
    dash: "--",
    name: "auto-pause",
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies Flag<typeof flagStr>);
});

test("name single dash -, type and required", () => {
  const flagStr = "--p!:number";

  expect(parseFlag(flagStr)).toEqual({
    dash: "--",
    name: "p",
    type: "number",
    explicitType: true,
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash --, type and required", () => {
  const flagStr = "--auto-pause!:number";

  expect(parseFlag(flagStr)).toEqual({
    dash: "--",
    name: "auto-pause",
    type: "number",
    explicitType: true,
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("no dashes with type, required and fallback", () => {
  const flagStr = "auto-pause!:number=456";

  expect(parseFlag(flagStr)).toEqual({
    dash: "",
    name: "auto-pause",
    type: "number",
    explicitType: true,
    required: true,
    fallback: 456,
  } satisfies Flag<typeof flagStr>);
});
