import { test } from "vitest";

import { DataTypeCastBooleanError } from "../../../src/data-type/errors/data-type-cast-boolean-error";
import { FlagFallbackCastError } from "../../../src/flag/errors/flag-fallback-cast-error";
import { createParseFlagMatcher } from "./utils/create-parse-flag-matcher";

test("implicit type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause");
});

test("explicit type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: true,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause:boolean");
});

test("truthy fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } as const);

  expectParseFlagMatch("--auto-pause=true");
  expectParseFlagMatch("--auto-pause=t");
  expectParseFlagMatch("--auto-pause=yes");
  expectParseFlagMatch("--auto-pause=y");
  expectParseFlagMatch("--auto-pause=1");
});

test("falsy fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: false,
  } as const);

  expectParseFlagMatch("--auto-pause=false");
  expectParseFlagMatch("--auto-pause=f");
  expectParseFlagMatch("--auto-pause=no");
  expectParseFlagMatch("--auto-pause=n");
  expectParseFlagMatch("--auto-pause=0");
});

test("invalid fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    __objectType__: "flag",
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: new FlagFallbackCastError(
      "auto-pause",
      new DataTypeCastBooleanError("definitely_not"),
    ),
  } as const);

  expectParseFlagMatch("--auto-pause=definitely_not");
});
