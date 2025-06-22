import { expect, test } from "vitest";

import { type ParseBlueprint, parseBlueprint } from "../src/blueprint";

// Note: blueprint tests are only to assert that the integration with `parseArg`
//       and `parseFlag` are working. Specific arg and flag cases are covered
//       by the respective test suites.

test("just the name", () => {
  const input = "foo";

  expect(parseBlueprint(input)).toEqual({
    name: "foo",
    parts: [] as never,
  } satisfies ParseBlueprint<typeof input>);
});

test("with arg but no flag", () => {
  const input = "foo arg_one";

  expect(parseBlueprint(input)).toEqual({
    name: "foo",
    parts: [
      {
        name: "arg_one",
        type: "string",
        explicitType: false,
        optional: false,
        fallback: null,
      },
    ],
  } satisfies ParseBlueprint<typeof input>);
});

test("with flag but no arg", () => {
  const input = "foo --flag_one(-f):number";

  expect(parseBlueprint(input)).toEqual({
    name: "foo",
    parts: [
      {
        name: "flag_one",
        short: "f",
        type: "number",
        explicitType: true,
        required: false,
        fallback: null,
      },
    ],
  } satisfies ParseBlueprint<typeof input>);
});
