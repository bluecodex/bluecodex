import { test } from "vitest";

import { createParseBlueprintMatcher } from "./utils/create-parse-blueprint-matcher";

// Note: blueprint tests are only to assert that the integration with `parseArg`
//       and `parseFlag` are working. Specific arg and flag cases are covered
//       by the respective test suites.

test("just the name", () => {
  const { expectParseBlueprintMatch } = createParseBlueprintMatcher({
    __objectType__: "blueprint",
    name: "foo",
    parts: [] as never,
  } as const);

  expectParseBlueprintMatch("foo");
});

test("with arg but no flag", () => {
  const { expectParseBlueprintMatch } = createParseBlueprintMatcher({
    __objectType__: "blueprint",
    name: "foo",
    parts: [
      {
        __objectType__: "arg",
        name: "arg_one",
        type: "string",
        explicitType: false,
        optional: false,
        fallback: null,
      },
    ],
  } as const);

  expectParseBlueprintMatch("foo arg_one");
});

test("with flag but no arg", () => {
  const { expectParseBlueprintMatch } = createParseBlueprintMatcher({
    __objectType__: "blueprint",
    name: "foo",
    parts: [
      {
        __objectType__: "flag",
        name: "flag_one",
        short: "f",
        type: "number",
        explicitType: true,
        required: false,
        fallback: null,
      },
    ],
  } as const);

  expectParseBlueprintMatch("foo --flag_one(-f):number");
});

test("with multiple args and flags", () => {
  const { expectParseBlueprintMatch } = createParseBlueprintMatcher({
    __objectType__: "blueprint",
    name: "model:new",
    parts: [
      {
        __objectType__: "arg",
        name: "name",
        type: "string",
        explicitType: false,
        optional: false,
        fallback: null,
      },
      {
        __objectType__: "arg",
        name: "domain",
        type: "string",
        explicitType: false,
        optional: true,
        fallback: null,
      },
      {
        __objectType__: "flag",
        name: "form",
        short: null,
        type: "boolean",
        explicitType: false,
        required: false,
        fallback: true,
      },
      {
        __objectType__: "flag",
        name: "prefix",
        short: "p",
        type: "string",
        explicitType: true,
        required: false,
        fallback: null,
      },
    ],
  } as const);

  expectParseBlueprintMatch(
    "model:new name domain? --form=true --prefix(-p):string",
  );
});
