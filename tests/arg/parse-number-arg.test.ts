import { test } from "vitest";

import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("single worded name + type", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "foo",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("foo:number");
});

test("number arg + valid fallback", () => {});

test("number arg + invalid fallback", () => {});

test("number arg + optional", () => {});

test("number arg + optional + invalid fallback", () => {});
