import { test } from "vitest";

import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("name with one word", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "foo",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("foo:number");
});

test("name with underscore", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "arg_one",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:number");
});

test("no type but fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "true",
  } as const);

  expectParseArgMatch("arg_one=true");
});

test("just name with optional", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one?");
});

test("name with optional + fallback", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: "blue",
  } as const);

  expectParseArgMatch("arg_one?=blue");
});

/*
 * Failure assertions
 */

test.fails("[fails] incorrect name", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "foo",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } as const);

  // @ts-expect-error this is incorrect, should fail
  expectParseArgMatch("bar");
});
