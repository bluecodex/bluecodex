import { test } from "vitest";

import { argTokenTestCase } from "./utils/arg-token-test-case";

test("boolean arg", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectArgTokenMatch("arg_one:boolean");
});

test("boolean arg + truthy fallback", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: true,
  } as const);

  expectArgTokenMatch("arg_one:boolean=true");
  expectArgTokenMatch("arg_one:boolean=t");
  expectArgTokenMatch("arg_one:boolean=yes");
  expectArgTokenMatch("arg_one:boolean=y");
  expectArgTokenMatch("arg_one:boolean=1");
});

test("boolean arg + falsy fallback", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: false,
  } as const);

  expectArgTokenMatch("arg_one:boolean=false");
  expectArgTokenMatch("arg_one:boolean=f");
  expectArgTokenMatch("arg_one:boolean=no");
  expectArgTokenMatch("arg_one:boolean=n");
  expectArgTokenMatch("arg_one:boolean=0");
});
