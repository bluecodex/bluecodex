import { expect } from "vitest";

import { type Arg, type ParseArg, parseArg } from "../../../src";
import { skipCustomFunctionInStackTrace } from "../../utils/test-error-utils";

// Ensure the flag is passed with `as const` to avoid attribute types being too broad
type IsLiteralArg<A extends Arg> = A["name"] extends `${infer _}` ? A : never;

/**
 * Utility for testing arg parsing. It creates a test case, so we can easily
 * assert that multiple argTokens output the same correct result during both
 * type-checking and runtime.
 */
export function parseArgTestCase<A extends Arg>(expected: A & IsLiteralArg<A>) {
  const expectParseArgMatch = <ArgToken extends string>(
    argToken: ArgToken & (ParseArg<ArgToken> extends A ? unknown : never),
  ) => {
    try {
      expect(parseArg(argToken)).toEqual(expected);
    } catch (error) {
      throw error instanceof Error
        ? skipCustomFunctionInStackTrace(error, "expectParseArgMatch")
        : error;
    }
  };

  return { expectParseArgMatch };
}
