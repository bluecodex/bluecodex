import { test } from "vitest";

import { argTokenTestCase } from "./utils/arg-token-test-case";

test("number arg", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectArgTokenMatch("arg_one:number");
});

test("number arg + valid fallback", () => {});

test("number arg + invalid fallback", () => {});

test("number arg + optional", () => {});

test("number arg + optional + invalid fallback", () => {});
