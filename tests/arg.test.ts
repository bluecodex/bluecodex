import { expect, test } from "vitest";

import { type ParseArg, parseArg } from "../src/arg";

test("just the name", () => {
  const argStr = "arg_one";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argStr>);
});

test("boolean type", () => {
  const argStr = "arg_one:boolean";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argStr>);
});

test("number type", () => {
  const argStr = "arg_one:number";
  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argStr>);
});

test("invalid type", () => {
  const argStr = "arg_one:invalid";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: true,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argStr>);
});

test("type + fallback", () => {
  const argStr = "arg_one:boolean=true";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: true,
  } satisfies ParseArg<typeof argStr>);
});

test("no type but fallback", () => {
  const argStr = "arg_one=true";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: false,
    fallback: "true",
  } satisfies ParseArg<typeof argStr>);
});

test("just name with optional", () => {
  const argStr = "arg_one?";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: null,
  } satisfies ParseArg<typeof argStr>);
});

test("name with optional + fallback", () => {
  const argStr = "arg_one?=blue";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    explicitType: false,
    optional: true,
    fallback: "blue",
  } satisfies ParseArg<typeof argStr>);
});
