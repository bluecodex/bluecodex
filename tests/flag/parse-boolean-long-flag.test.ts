import { test } from "vitest";

import { DataTypeCastBooleanError } from "../../src/data-type/errors/data-type-cast-boolean-error";
import { FlagFallbackCastError } from "../../src/flag/errors/flag-fallback-cast-error";
import { createParseFlagMatcher } from "./utils/create-parse-flag-matcher";

test("long and short name", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
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
  const { expectParseFlagMatch } = createParseFlagMatcher({
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
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: true,
  } as const);

  expectParseFlagMatch("--auto-pause=true");
});

test("invalid fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
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
