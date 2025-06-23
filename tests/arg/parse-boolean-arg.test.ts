import { test } from "vitest";

import { parseArgTestCase } from "./utils/parse-arg-test-case";

test("boolean arg", () => {
  const { expectParseArgMatch } = parseArgTestCase({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:boolean");
});

test("boolean arg + truthy fallback", () => {
  const { expectParseArgMatch } = parseArgTestCase({
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

test("boolean arg + falsy fallback", () => {
  const { expectParseArgMatch } = parseArgTestCase({
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
