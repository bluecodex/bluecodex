import { expect, expectTypeOf, test } from "vitest";

import { InvalidAliasNameError } from "../../../src/alias/errors/invalid-alias-name-error";
import { MalformattedAliasError } from "../../../src/alias/errors/malformatted-alias-error";
import { parseAlias } from "../../../src/alias/parse-alias";
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

test("malformatted", () => {
  const aliasToken = "foo-bar";
  const result = parseAlias(aliasToken);
  const error = new MalformattedAliasError(aliasToken);

  expect(result).toEqual(error);
  expectTypeOf(result).toEqualTypeOf<typeof error>();
});

test("invalid alias name", () => {
  const aliasToken = "fo o=bar";
  const result = parseAlias(aliasToken);
  const error = new InvalidAliasNameError("fo o");

  expect(result).toEqual(error);
  expectTypeOf(result).toEqualTypeOf<typeof error>();
});
