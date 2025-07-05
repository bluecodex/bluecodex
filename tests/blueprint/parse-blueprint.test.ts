import { expect, test } from "vitest";

import {
  type ParseBlueprint,
  parseBlueprint,
} from "../../src/blueprint/parse-blueprint";

// Note: blueprint tests are only to assert that the integration with `parseArg`
//       and `parseFlag` are working. Specific arg and flag cases are covered
//       by the respective test suites.

test("just the name", () => {
  const blueprintToken = "foo";

  expect(parseBlueprint(blueprintToken)).toEqual({
    __objectType__: "blueprint",
    name: "foo",
    parts: [] as never,
  } satisfies ParseBlueprint<typeof blueprintToken>);
});

test("with arg but no flag", () => {
  const blueprintToken = "foo arg_one";

  expect(parseBlueprint(blueprintToken)).toEqual({
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
  } satisfies ParseBlueprint<typeof blueprintToken>);
});

test("with flag but no arg", () => {
  const blueprintToken = "foo --flag_one(-f):number";

  expect(parseBlueprint(blueprintToken)).toEqual({
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
  } satisfies ParseBlueprint<typeof blueprintToken>);
});

test.todo("with multiple args and flags", () => {});

test.todo("with stray - in the string", () => {});

test.todo("with stray -- in the string", () => {});
