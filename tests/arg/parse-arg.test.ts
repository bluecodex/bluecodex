import { test } from "vitest";

import { InvalidArgTypeError } from "../../src/arg/errors/invalid-arg-type-error";
import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("single word name", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "foo",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("foo");
});

test("name with underscore", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one");
});

test("name with dash", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg-one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg-one");
});

test("invalid type", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: new InvalidArgTypeError("arg_one", "foobar"),
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:foobar");
});

test("optional", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one?");
});

test("implicit type + optional + fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: "blue",
  } as const);

  expectParseArgMatch("arg_one?=blue");
});

test("explicit type + optional + fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "number",
    explicitType: true,
    optional: true,
    fallback: 14,
  } as const);

  expectParseArgMatch("arg_one?:number=14");
});
