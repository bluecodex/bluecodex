import { test } from "vitest";

import { DataTypeCastNumberError } from "../../src/data-type/errors/data-type-cast-number-error";
import { FlagFallbackCastError } from "../../src/flag/errors/flag-fallback-cast-error";
import { createParseFlagMatcher } from "./utils/create-parse-flag-matcher";

test("name + type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "count",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--count:number");
});

test("valid fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "count",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 12,
  } as const);

  expectParseFlagMatch("--count:number=12");
});

test("invalid fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "count",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: new FlagFallbackCastError(
      "count",
      new DataTypeCastNumberError("12b"),
    ),
  } as const);

  expectParseFlagMatch("--count:number=12b");
});
