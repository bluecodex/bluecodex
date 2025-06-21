import { expect, test } from "vitest";

import { type FlagFromInput, parseFlag } from "../src/flag";

test("just the name with one dash -", () => {
  const flagStr = "-p";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("just the name with double dash -- and short", () => {
  const flagStr = "--auto-pause(-P)";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: "P",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("just the name with double dash -- and short", () => {
  const flagStr = "--auto-pause";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("name with single dash - and fallback", () => {
  const flagStr = "-p=true";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("name with double dash -- and fallback", () => {
  const flagStr = "--auto-pause=true";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("name with single dash -, type and fallback", () => {
  const flagStr = "-p:number=123";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("name with double dash --, type and fallback", () => {
  const flagStr = "--auto-pause:number=123";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("name single dash -, type and required", () => {
  const flagStr = "-p!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("name with double dash --, type, required and short", () => {
  const flagStr = "--auto-pause!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("name with double dash --, type, required and short", () => {
  const flagStr = "--auto-pause(-a)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("single dash - with two letters only picks the first one", () => {
  const flagStr = "-ab!:number=2";

  expect(parseFlag(flagStr)).toEqual({
    name: "a",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: 2,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("double dash with two-lettered alias only picks the first one", () => {
  const flagStr = "--auto-pause(-ab)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("double dash with parenthesis but no dash - has null short", () => {
  const flagStr = "--auto-pause(a)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

test("double dash with parenthesis and dash - inside but no letter has null short", () => {
  const flagStr = "--auto-pause(-)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies FlagFromInput<typeof flagStr>);
});

// TODO: add invalid cast of number test
