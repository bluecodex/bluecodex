import { test } from "vitest";

import { InvalidArgTypeError } from "../../src/arg";
import { createParseArgMatcher } from "./utils/create-parse-arg-matcher";

test("invalid type yield error", () => {
  const { expectParseArgMatch } = createParseArgMatcher({
    name: "arg_one",
    type: new InvalidArgTypeError("arg_one", "foobar"),
    explicitType: true,
    optional: false,
    fallback: null,
  } as const);

  expectParseArgMatch("arg_one:foobar");
});
