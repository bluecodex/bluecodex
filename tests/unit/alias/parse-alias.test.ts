import { test } from "vitest";

import { createParseAliasMatcher } from "./utils/create-parse-alias-matcher";

test("just name", () => {
  const { expectParseAliasMatch } = createParseAliasMatcher({
    __objectType__: "alias",
    name: "foo",
    target: "bar",
    meta: {},
  } as const);

  expectParseAliasMatch("foo=bar");
});

test("with argv", () => {
  const { expectParseAliasMatch } = createParseAliasMatcher({
    __objectType__: "alias",
    name: "foo",
    target: "bar one two",
    meta: {},
  } as const);

  expectParseAliasMatch("foo=bar one two");
});
