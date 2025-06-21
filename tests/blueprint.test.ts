import { expect, test } from "vitest";

import { type Blueprint, blueprint } from "../src/blueprint";

// Note: blueprint tests are only to assert that the integration with `parseArg`
//       and `parseFlag` are working. Specific arg and flag cases are covered
//       by the respective test suites.

test("just the name", () => {
  const input = "foo";

  expect(blueprint(input)).toEqual({
    name: "foo",
    args: [],
    flags: [],
  } satisfies Blueprint<typeof input>);
});

test("with arg but no flag", () => {
  const input = "foo arg_one";

  expect(blueprint(input)).toEqual({
    name: "foo",
    args: [
      {
        name: "arg_one",
        type: "string",
        explicitType: false,
        optional: false,
        fallback: null,
      },
    ],
    flags: [],
  } satisfies Blueprint<typeof input>);
});

test("with flag but no arg", () => {
  const input = "foo --flag_one(-f):number";

  expect(blueprint(input)).toEqual({
    name: "foo",
    args: [],
    flags: [
      {
        name: "flag_one",
        short: "f",
        type: "number",
        explicitType: true,
        required: false,
        fallback: null,
      },
    ],
  } satisfies Blueprint<typeof input>);
});
