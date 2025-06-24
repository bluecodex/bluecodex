import { expect } from "vitest";

import { type Arg, type ParseArg, parseArg } from "../../../src";
import { skipCustomFunctionInStackTrace } from "../../utils/test-error-utils";

// Ensure the arg is passed with `as const` to avoid attribute types being too broad
type IsLiteralArg<A extends Arg> = A["name"] extends `${infer _}` ? A : never;

/**
 * Utility for testing `parseArg`.
 *
 * It returns a function that can be used to assert multiple times the
 * given `argToken` returns proper values and types, it can assert both
 * success and failure cases, including type-checking.
 */
export function createParseArgMatcher<A extends Arg>(
  expected: A & IsLiteralArg<A>,
) {
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

  const expectFailParseArgMatch = <ArgToken extends string>(
    argToken: ArgToken & (ParseArg<ArgToken> extends A ? never : unknown),
  ) => {
    try {
      expect(parseArg(argToken)).not.toEqual(expected);
    } catch (error) {
      throw error instanceof Error
        ? skipCustomFunctionInStackTrace(error, "expectFailParseArgMatch")
        : error;
    }
  };

  return { expectParseArgMatch, expectFailParseArgMatch };
}
