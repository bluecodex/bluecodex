import { expect, test } from "vitest";

import { type ParseFlag, parseFlag } from "../src/flag";

test("short name only", () => {
  const flagStr = "-p";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("long and short name", () => {
  const flagStr = "--auto-pause(-P)";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: "P",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("long name only", () => {
  const flagStr = "--auto-pause";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("short with fallback", () => {
  const flagStr = "-p=true";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies ParseFlag<typeof flagStr>);
});

test("long with fallback", () => {
  const flagStr = "--auto-pause=true";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies ParseFlag<typeof flagStr>);
});

test("short with type and fallback", () => {
  const flagStr = "-p:number=123";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies ParseFlag<typeof flagStr>);
});

test("long with type and fallback", () => {
  const flagStr = "--auto-pause:number=123";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies ParseFlag<typeof flagStr>);
});

test("required short with type", () => {
  const flagStr = "-p!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("required long with type", () => {
  const flagStr = "--auto-pause!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("required long with alisa and type", () => {
  const flagStr = "--auto-pause(-a)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("short with extra invalid character", () => {
  const flagStr = "-ab!:number=2";

  expect(parseFlag(flagStr)).toEqual({
    name: "a",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: 2,
  } satisfies ParseFlag<typeof flagStr>);
});

test("long with short containing extra invalid character", () => {
  const flagStr = "--auto-pause(-ab)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("long with short missing dash", () => {
  const flagStr = "--auto-pause(a)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

test("long with short missing letter", () => {
  const flagStr = "--auto-pause(-)!:number";

  expect(parseFlag(flagStr)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagStr>);
});

// TODO: add invalid cast of number test
