import { expect, test } from "vitest";

import { type Blueprint, blueprint } from "../src/blueprint";

test("just the name", () => {
  const input = "foo";

  expect(blueprint(input)).toEqual({
    name: "foo",
    args: [],
    flags: [],
  } satisfies Blueprint<typeof input>);
});

test("with arg but no explicit type", () => {
  const input = "foo arg_one";

  expect(blueprint(input)).toEqual({
    name: "foo",
    args: [
      {
        name: "arg_one",
        type: "string",
        explicitType: false,
        optional: false,
        fallback: undefined,
      },
    ],
    flags: [],
  } satisfies Blueprint<typeof input>);
});
