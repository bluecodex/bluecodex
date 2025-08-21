import { test } from "vitest";

import { ArgFallbackCastError } from "../../../src/arg/errors/arg-fallback-cast-error";
import { DataTypeCastNumberError } from "../../../src/data-type/errors/data-type-cast-number-error";
import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("name + type", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "foo",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("foo:number");
});

test("valid fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "foo",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: 15,
  } as const);

  expectParseArgMatch("foo:number=15");
});

test("invalid fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "foo",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: new ArgFallbackCastError(
      "foo",
      new DataTypeCastNumberError("1a5"),
    ),
  } as const);

  expectParseArgMatch("foo:number=1a5");
});
