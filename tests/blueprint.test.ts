import { expect, test } from "vitest";

import { type Blueprint, blueprint } from "../src/blueprint";

test("just the name", () => {
  expect(blueprint("foo")).toEqual({
    name: "foo",
    args: [],
    flags: [],
  } satisfies Blueprint<"foo">);
});

test("with arg but no explicit type", () => {
  const blueprintStr = "foo arg_one";

  expect(blueprint(blueprintStr)).toEqual({
    name: "foo",
    args: [
      { name: "arg_one", type: "string", optional: false, fallback: undefined },
    ],
    flags: [],
  } satisfies Blueprint<typeof blueprintStr>);
});
