import { test } from "vitest";

import { createParseFlagMatcher } from "./utils/create-parse-flag-matcher";

test("name + type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "group",
    short: null,
    type: "string",
    explicitType: true,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--group:string");
});

test("string-looking fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "group",
    short: null,
    type: "string",
    explicitType: true,
    required: false,
    fallback: "auth",
  } as const);

  expectParseFlagMatch("--group:string=auth");
});

test("boolean-looking fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "group",
    short: null,
    type: "string",
    explicitType: true,
    required: false,
    fallback: "false",
  } as const);

  expectParseFlagMatch("--group:string=false");
});

test("number-looking fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "group",
    short: null,
    type: "string",
    explicitType: true,
    required: false,
    fallback: "12",
  } as const);

  expectParseFlagMatch("--group:string=12");
});
