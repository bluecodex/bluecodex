import { expect } from "vitest";

import { type Flag, type ParseFlag, parseFlag } from "../../../src";
import { skipCustomFunctionInStackTrace } from "../../utils/test-error-utils";

// Ensure the flag is passed with `as const` to avoid attribute types being too broad
type IsLiteralFlag<F extends Flag> = F["name"] extends `${infer _}` ? F : never;

/**
 * Utility for testing `parseFlag`.
 *
 * It returns a function that can be used to assert multiple times the
 * given `flagToken` returns proper values and types, it can assert both
 * success and failure cases, including type-checking.
 */
export function createParseFlagMatcher<F extends Flag>(
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
