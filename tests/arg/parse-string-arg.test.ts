import { test } from "vitest";

import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("single word name", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "foo",
      type: "string",
      explicitType: false,
      optional: false,
      fallback: null,
    } as const);

  expectParseArgMatch("foo");
  expectFailParseArgMatch("bar");
});

test("name with underscore", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "string",
      explicitType: false,
      optional: false,
      fallback: null,
    } as const);

  expectParseArgMatch("arg_one");
  expectFailParseArgMatch("argone");
});

test("name with dash", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg-one",
      type: "string",
      explicitType: false,
      optional: false,
      fallback: null,
    } as const);

  expectParseArgMatch("arg-one");
  expectFailParseArgMatch("arg_one");
});

test("invalid type defaults to string", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "arg_one",
    type: "string",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:invalid");
});

test("no type + fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "string",
      explicitType: false,
      optional: false,
      fallback: "red",
    } as const);

  expectParseArgMatch("arg_one=red");
  expectFailParseArgMatch("arg_one=blue");
});

test("no type + boolean-looking fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "string",
      explicitType: false,
      optional: false,
      fallback: "true",
    } as const);

  expectParseArgMatch("arg_one=true");
  expectFailParseArgMatch("arg_one=false");
});

test("no type + number-looking fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "string",
      explicitType: false,
      optional: false,
      fallback: "10",
    } as const);

  expectParseArgMatch("arg_one=10");
  expectFailParseArgMatch("arg_one=11");
});

test("optional", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "string",
      explicitType: false,
      optional: true,
      fallback: null,
    } as const);

  expectParseArgMatch("arg_one?");
  expectFailParseArgMatch("arg_one");
});

test("type + optional", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "string",
      explicitType: true,
      optional: true,
      fallback: null,
    } as const);

  expectParseArgMatch("arg_one?:string");
  expectFailParseArgMatch("arg_one:string");
});

test("optional + fallback", () => {
  const { expectParseArgMatch, expectFailParseArgMatch } =
    createParseArgMatcher({
      name: "arg_one",
      type: "string",
      explicitType: false,
      optional: true,
      fallback: "blue",
    } as const);

  expectParseArgMatch("arg_one?=blue");
  expectFailParseArgMatch("arg_one=blue");
});
