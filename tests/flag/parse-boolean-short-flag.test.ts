import { test } from "vitest";

import { createParseFlagMatcher } from "./utils/create-parse-flag-matcher";

test("short name only", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("-p");
});

test("short with fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } as const);

  expectParseFlagMatch("-p=true");
});

test("short with type and fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } as const);

  expectParseFlagMatch("-p:number=123");
});

test("required short with type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("-p!:number");
});

test("short with extra invalid character", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "a",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: 2,
  } as const);

  expectParseFlagMatch("-ab!:number=2");
});

test("invalid number fallback is ignored", () => {});
// TODO: add invalid cast of number test
