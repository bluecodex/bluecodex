import { test } from "vitest";

import { parseFlagTestCase } from "./utils/parse-flag-test-case";

test("long and short name", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: "P",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-P)");
});

test("long name only", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause");
});

test("long with fallback", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } as const);

  expectParseFlagMatch("--auto-pause=true");
});

test("long with type and fallback", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } as const);

  expectParseFlagMatch("--auto-pause:number=123");
});

test("required long with type", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause!:number");
});

test("required long with alisa and type", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-a)!:number");
});

test("long with short containing extra invalid character", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-ab)!:number");
});

test("long with short missing dash", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(a)!:number");
});

test("long with short missing letter", () => {
  const { expectParseFlagMatch } = parseFlagTestCase({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-)!:number");
});
