import { test } from "vitest";

import { ArgFallbackCastError } from "../../src/arg";
import { CastBooleanError } from "../../src/data-type";
import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("name + type", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "watch",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("watch:boolean");
});

test("truthy fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
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

  expectFailParseArgMatch("arg_one:boolean=0");
  expectFailParseArgMatch("arg_one=true");
});

test("falsy fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
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

  expectFailParseArgMatch("arg_one:boolean=1");
  expectFailParseArgMatch("arg_one=false");
});

test("invalid fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "boolean",
      explicitType: true,
      optional: false,
      fallback: new ArgFallbackCastError(
        "arg_one",
        new CastBooleanError("definitely_not"),
      ),
    } as const);

  expectParseArgMatch("arg_one:boolean=definitely_not");
  expectFailParseArgMatch("arg_one:boolean=true");
});

test("optional", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "boolean",
      explicitType: true,
      optional: true,
      fallback: null,
    } as const);

  expectParseArgMatch("foo?:boolean");
  expectFailParseArgMatch("foo:boolean");
});

test("optional + fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "boolean",
      explicitType: true,
      optional: true,
      fallback: true,
    } as const);

  expectParseArgMatch("foo?:boolean=true");
  expectFailParseArgMatch("foo:boolean=true");
});
