import { expect, test } from "vitest";

import { type Flag, parseFlag } from "../src/flag";

test("just the name with one dash -", () => {
  const flagStr = "-p";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    type: "boolean",
    explicitType: false,
    short: true,
    required: false,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("just the name with double dash -- and short", () => {
  const flagStr = "--auto-pause(-P)";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "boolean",
    explicitType: false,
    short: "P",
    required: false,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("just the name with double dash -- and short", () => {
  const flagStr = "--auto-pause";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "boolean",
    explicitType: false,
    short: null,
    required: false,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("name with single dash - and fallback", () => {
  const flagStr = "-p=true";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    type: "boolean",
    explicitType: false,
    short: true,
    required: false,
    fallback: true,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash -- and fallback", () => {
  const flagStr = "--auto-pause=true";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "boolean",
    explicitType: false,
    short: null,
    required: false,
    fallback: true,
  } satisfies Flag<typeof flagStr>);
});

test("name with single dash -, type and fallback", () => {
  const flagStr = "--p:number=123";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    type: "number",
    explicitType: true,
    short: null,
    required: false,
    fallback: 123,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash --, type and fallback", () => {
  const flagStr = "--auto-pause:number=123";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    explicitType: true,
    short: null,
    required: false,
    fallback: 123,
  } satisfies Flag<typeof flagStr>);
});

test("name single dash -, type and required", () => {
  const flagStr = "--p!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    type: "number",
    explicitType: true,
    short: null,
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash --, type, required and short", () => {
  const flagStr = "--auto-pause!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    explicitType: true,
    short: null,
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("name with double dash --, type, required and short", () => {
  const flagStr = "--auto-pause(-a)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    explicitType: true,
    short: "a",
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("single dash - with two letters only picks the first one", () => {
  const flagStr = "-ab!:number=2";

  expect(parseFlag(flagStr)).toEqual({
    name: "a",
    type: "number",
    explicitType: true,
    short: true,
    required: true,
    fallback: 2,
  } satisfies Flag<typeof flagStr>);
});

test("double dash with two-lettered alias only picks the first one", () => {
  const flagStr = "--auto-pause(-ab)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    explicitType: true,
    short: "a",
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("double dash with parenthesis but no dash - has null short", () => {
  const flagStr = "--auto-pause(a)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    explicitType: true,
    short: null,
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});

test("double dash with parenthesis and dash - inside but no letter has null short", () => {
  const flagStr = "--auto-pause(-)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    type: "number",
    explicitType: true,
    short: null,
    required: true,
    fallback: undefined,
  } satisfies Flag<typeof flagStr>);
});
