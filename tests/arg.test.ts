import { expect, test } from "vitest";

import { type Arg, parseArg } from "../src/arg";

test("just the name", () => {
  const argStr = "arg_one";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    optional: false,
    fallback: undefined,
  } satisfies Arg<typeof argStr>);
});

test("boolean type", () => {
  const argStr = "arg_one:boolean";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "boolean",
    optional: false,
    fallback: undefined,
  } satisfies Arg<typeof argStr>);
});

test("number type", () => {
  const argStr = "arg_one:number";
  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "number",
    optional: false,
    fallback: undefined,
  } satisfies Arg<typeof argStr>);
});

test("invalid type", () => {
  const argStr = "arg_one:invalid";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    optional: false,
    fallback: undefined,
  } satisfies Arg<typeof argStr>);
});

test("type + fallback", () => {
  const argStr = "arg_one:boolean=true";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "boolean",
    optional: false,
    fallback: true,
  } satisfies Arg<typeof argStr>);
});

test("no type but fallback", () => {
  const argStr = "arg_one=true";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    optional: false,
    fallback: "true",
  } satisfies Arg<typeof argStr>);
});

test("just name with optional", () => {
  const argStr = "arg_one?";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    optional: true,
    fallback: undefined,
  } satisfies Arg<typeof argStr>);
});

test("name with optional + fallback", () => {
  const argStr = "arg_one?=blue";

  expect(parseArg(argStr)).toEqual({
    name: "arg_one",
    type: "string",
    optional: true,
    fallback: "blue",
  } satisfies Arg<typeof argStr>);
});
