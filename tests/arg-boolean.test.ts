import { expect, test } from "vitest";

import { type ParseArg, parseArg } from "../src";
import { argTestCase } from "./utils/arg-test-case";

test("boolean arg", () => {
  const argToken = "arg_one:boolean";

  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argToken>);
});

test("boolean arg + truthy fallback", () => {
  const { expectArgMatch } = argTestCase({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: true,
  } as const);

  expectArgMatch(parseArg("arg_one:boolean=true"));
  expectArgMatch(parseArg("arg_one:boolean=t"));
  expectArgMatch(parseArg("arg_one:boolean=yes"));
  expectArgMatch(parseArg("arg_one:boolean=y"));
  expectArgMatch(parseArg("arg_one:boolean=1"));
});

test("boolean arg + falsy fallback", () => {
  const { expectArgMatch } = argTestCase({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: false,
  } as const);

  expectArgMatch(parseArg("arg_one:boolean=false"));
  expectArgMatch(parseArg("arg_one:boolean=f"));
  expectArgMatch(parseArg("arg_one:boolean=no"));
  expectArgMatch(parseArg("arg_one:boolean=n"));
  expectArgMatch(parseArg("arg_one:boolean=0"));
});
