import { test } from "vitest";

import { parseArgTestCase } from "./utils/parse-arg-test-case";

test("just the name", () => {
  const { expectParseArgMatch } = parseArgTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one");
});

test("no type but fallback", () => {
  const { expectParseArgMatch } = parseArgTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "true",
  } as const);

  expectParseArgMatch("arg_one=true");
});

test("just name with optional", () => {
  const { expectParseArgMatch } = parseArgTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one?");
});

test("name with optional + fallback", () => {
  const { expectParseArgMatch } = parseArgTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: "blue",
  } as const);

  expectParseArgMatch("arg_one?=blue");
});
