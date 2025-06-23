import { test } from "vitest";

import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("invalid type", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "arg_one",
    type: "string",
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:invalid");
});
