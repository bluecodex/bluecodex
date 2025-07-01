import { test } from "vitest";

import { ArgFallbackCastError } from "../../src/arg";
import { CastNumberError } from "../../src/data-type";
import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("name + type", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "number",
      explicitType: true,
      optional: false,
      fallback: null,
    } as const);

  expectParseArgMatch("foo:number");
  expectFailParseArgMatch("foo:num");
});

test("valid fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "number",
      explicitType: true,
      optional: false,
      fallback: 15,
    } as const);

  expectParseArgMatch("foo:number=15");
  expectFailParseArgMatch("foo=15");
});

test("invalid fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "number",
      explicitType: true,
      optional: false,
      fallback: new ArgFallbackCastError("foo", new CastNumberError("1a5")),
    } as const);

  expectParseArgMatch("foo:number=1a5");
  expectFailParseArgMatch("foo:number=14");
});

test("optional", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "number",
      explicitType: true,
      optional: true,
      fallback: null,
    } as const);

  expectParseArgMatch("foo?:number");
  expectFailParseArgMatch("foo:number");
});

test("optional + fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "number",
      explicitType: true,
      optional: true,
      fallback: 15,
    } as const);

  expectParseArgMatch("foo?:number=15");
  expectFailParseArgMatch("foo:number=15");
});
