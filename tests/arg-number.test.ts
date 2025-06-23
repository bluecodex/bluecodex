import { test } from "vitest";

import { parseArg } from "../src";
import { argTestCase } from "./utils/arg-test-case";

test("number arg", () => {
  const { expectArgMatch } = argTestCase({
    name: "arg_one",
    type: "number",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectArgMatch(parseArg("arg_one:number"));
});

test("number arg + valid fallback", () => {});

test("number arg + invalid fallback", () => {});

test("number arg + optional", () => {});

test("number arg + optional + invalid fallback", () => {});
