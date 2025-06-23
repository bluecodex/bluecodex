import { expect } from "vitest";

import { type Flag, type ParseFlag, parseFlag } from "../../../src";
import { skipCustomFunctionInStackTrace } from "../../utils/test-error-utils";

// Ensure the flag is passed with `as const` to avoid attribute types being too broad
type IsLiteralFlag<F extends Flag> = F["name"] extends `${infer _}` ? F : never;

/**
 * Utility for testing flag parsing. It creates a test case, so we can easily
 * assert that multiple flagTokens output the same correct result during both
 * type-checking and runtime.
 */
export function parseFlagTestCase<F extends Flag>(
  expected: F & IsLiteralFlag<F>,
) {
  const expectParseFlagMatch = <FlagToken extends string>(
    flagToken: FlagToken & (ParseFlag<FlagToken> extends F ? unknown : never),
  ) => {
    try {
      expect(parseFlag(flagToken)).toEqual(expected);
    } catch (error) {
      throw error instanceof Error
        ? skipCustomFunctionInStackTrace(error, "expectParseFlagMatch")
        : error;
    }
  };

  return { expectParseFlagMatch };
}
