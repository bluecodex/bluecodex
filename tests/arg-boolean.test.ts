import { expect, test } from "vitest";

import { type ParseArg, parseArg } from "../src";

test("boolean arg", () => {
  const argToken = "arg_one:boolean";

  expect(parseArg(argToken)).toEqual({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: null,
  } satisfies ParseArg<typeof argToken>);
});

test("boolean arg + truthy fallback", () => {
  const argToken = "arg_one:boolean=true";

  const referenceArg = parseArg(argToken);
  expect(referenceArg).toEqual({
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: true,
  } satisfies ParseArg<typeof argToken>);

  expect(parseArg("arg_one:boolean=t")).toEqual(referenceArg);
  expect(parseArg("arg_one:boolean=yes")).toEqual(referenceArg);
  expect(parseArg("arg_one:boolean=y")).toEqual(referenceArg);
  expect(parseArg("arg_one:boolean=1")).toEqual(referenceArg);
});

test("boolean arg + falsy fallback", () => {
  const argToken = "arg_one:boolean=false";

  const expected = {
    name: "arg_one",
    type: "boolean",
    explicitType: true,
    optional: false,
    fallback: false,
  } satisfies ParseArg<typeof argToken>;

  expect(parseArg(argToken)).toEqual(expected);

  // Variations

  // TODO: add satisfies to also test the type parser
  expect(parseArg("arg_one:boolean=f")).toEqual(expected);
  expect(parseArg("arg_one:boolean=no")).toEqual(expected);
  expect(parseArg("arg_one:boolean=n")).toEqual(expected);
  expect(parseArg("arg_one:boolean=0")).toEqual(expected);
});
