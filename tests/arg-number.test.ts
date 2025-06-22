import { expect, test } from "vitest";

import { type ParseArg, parseArg } from "../src";

test("number arg", () => {
  const argToken = "arg_one:number";
  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argToken>);
});

test("number arg + valid fallback", () => {});

test("number arg + invalid fallback", () => {});

test("number arg + optional", () => {});

test("number arg + optional + invalid fallback", () => {});
