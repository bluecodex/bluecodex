import { test } from "vitest";

import { parseArgTestCase } from "./utils/parse-arg-test-case";

test("invalid type", () => {
  const { expectParseArgMatch } = parseArgTestCase({
    name: "arg_one",
    type: "string",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:invalid");
});
