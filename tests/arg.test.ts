import { expect, test } from "vitest";

import { type ParseArg, parseArg } from "../src/arg";

test("just the name", () => {
  const argToken = "arg_one";

  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argToken>);
});

test("invalid type", () => {
  const argToken = "arg_one:invalid";

  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: true,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argToken>);
});

test("no type but fallback", () => {
  const argToken = "arg_one=true";

  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "true",
  } satisfies ParseArg<typeof argToken>);
});

test("just name with optional", () => {
  const argToken = "arg_one?";

  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: null,
  } satisfies ParseArg<typeof argToken>);
});

test("name with optional + fallback", () => {
  const argToken = "arg_one?=blue";

  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: "blue",
  } satisfies ParseArg<typeof argToken>);
});
