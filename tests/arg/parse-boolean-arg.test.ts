import { test } from "vitest";

import { ArgFallbackCastError } from "../../src/arg/errors/arg-fallback-cast-error";
import { DataTypeCastBooleanError } from "../../src/data-type/errors/data-type-cast-boolean-error";
import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("explicit type", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "watch",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("watch:boolean");
});

test("truthy fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: true,
  } as const);

  expectParseArgMatch("arg_one:boolean=true");
  expectParseArgMatch("arg_one:boolean=t");
  expectParseArgMatch("arg_one:boolean=yes");
  expectParseArgMatch("arg_one:boolean=y");
  expectParseArgMatch("arg_one:boolean=1");
});

test("falsy fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: false,
  } as const);

  expectParseArgMatch("arg_one:boolean=false");
  expectParseArgMatch("arg_one:boolean=f");
  expectParseArgMatch("arg_one:boolean=no");
  expectParseArgMatch("arg_one:boolean=n");
  expectParseArgMatch("arg_one:boolean=0");
});

test("invalid fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: new ArgFallbackCastError(
      "arg_one",
      new DataTypeCastBooleanError("definitely_not"),
    ),
  } as const);

  expectParseArgMatch("arg_one:boolean=definitely_not");
});
