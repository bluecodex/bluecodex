import { test } from "vitest";

import { argTokenTestCase } from "./utils/arg-token-test-case";

test("invalid type", () => {
  const { expectArgTokenMatch } = argTokenTestCase({
    name: "arg_one",
    type: "string",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectArgTokenMatch("arg_one:invalid");
});
