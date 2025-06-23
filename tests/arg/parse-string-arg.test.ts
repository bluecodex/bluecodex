import { test } from "vitest";

import { argTokenTestCase } from "./utils/arg-token-test-case";

test("just the name", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } as const);

  expectArgTokenMatch("arg_one");
});

test("no type but fallback", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "true",
  });

  expectArgTokenMatch("arg_one=true");
});

test("just name with optional", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: null,
  } as const);

  expectArgTokenMatch("arg_one?");
});

test("name with optional + fallback", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: "blue",
  });

  expectArgTokenMatch("arg_one?=blue");
});
