import { expect } from "vitest";

import type { Arg, ParseArg } from "../../../src";
import { skipCustomFunctionInStackTrace } from "../../utils/test-error-utils";

export function argTokenTestCase<A extends Arg>(expected: A) {
  const expectArgTokenMatch = <ArgToken extends string>(
    testCase: ArgToken & (ParseArg<ArgToken> extends A ? unknown : never),
  ) => {
    try {
      expect(testCase).toEqual(expected);
    } catch (error) {
      throw error instanceof Error
        ? skipCustomFunctionInStackTrace(error, "expectArgTokenMatch")
        : error;
    }
  };

  return { expectArgTokenMatch };
}
