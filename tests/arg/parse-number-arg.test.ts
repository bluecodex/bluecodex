import { test } from "vitest";

import { parseArgTestCase } from "./utils/parse-arg-test-case";

test("number arg", () => {
  const { expectParseArgMatch } = parseArgTestCase({
    name: "arg_one",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:number");
});

test("number arg + valid fallback", () => {});

test("number arg + invalid fallback", () => {});

test("number arg + optional", () => {});

test("number arg + optional + invalid fallback", () => {});
