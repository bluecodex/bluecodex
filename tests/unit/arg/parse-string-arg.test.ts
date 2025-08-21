import { test } from "vitest";

import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("implicit type", () => {
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

test("explicit type", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "string",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:string");
});

test("string-looking fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "red",
  } as const);

  expectParseArgMatch("arg_one=red");
});

test("boolean-looking fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "true",
  } as const);

  expectParseArgMatch("arg_one=true");
});

test("number-looking fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    __objectType__: "arg",
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "10",
  } as const);

  expectParseArgMatch("arg_one=10");
});
