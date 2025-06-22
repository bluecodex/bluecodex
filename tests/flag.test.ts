import { expect, test } from "vitest";

import { type ParseFlag, parseFlag } from "../src/flag";

test("short name only", () => {
  const flagToken = "-p";

  expect(parseFlag(flagToken)).toEqual({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("long and short name", () => {
  const flagToken = "--auto-pause(-P)";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: "P",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("long name only", () => {
  const flagToken = "--auto-pause";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("short with fallback", () => {
  const flagToken = "-p=true";

  expect(parseFlag(flagToken)).toEqual({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies ParseFlag<typeof flagToken>);
});

test("long with fallback", () => {
  const flagToken = "--auto-pause=true";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } satisfies ParseFlag<typeof flagToken>);
});

test("short with type and fallback", () => {
  const flagToken = "-p:number=123";

  expect(parseFlag(flagToken)).toEqual({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies ParseFlag<typeof flagToken>);
});

test("long with type and fallback", () => {
  const flagToken = "--auto-pause:number=123";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } satisfies ParseFlag<typeof flagToken>);
});

test("required short with type", () => {
  const flagToken = "-p!:number";

  expect(parseFlag(flagToken)).toEqual({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("required long with type", () => {
  const flagToken = "--auto-pause!:number";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("required long with alisa and type", () => {
  const flagToken = "--auto-pause(-a)!:number";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("short with extra invalid character", () => {
  const flagToken = "-ab!:number=2";

  expect(parseFlag(flagToken)).toEqual({
    name: "a",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: 2,
  } satisfies ParseFlag<typeof flagToken>);
});

test("long with short containing extra invalid character", () => {
  const flagToken = "--auto-pause(-ab)!:number";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("long with short missing dash", () => {
  const flagToken = "--auto-pause(a)!:number";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("long with short missing letter", () => {
  const flagToken = "--auto-pause(-)!:number";

  expect(parseFlag(flagToken)).toEqual({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } satisfies ParseFlag<typeof flagToken>);
});

test("invalid number fallback is ignored", () => {});
// TODO: add invalid cast of number test
