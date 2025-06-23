import { expect } from "vitest";

import type { Arg } from "../../src";
import { skipCustomFunctionInStackTrace } from "./error-utils";

export function argTestCase<A extends Arg>(expected: A) {
  const expectArgMatch = (testCase: A) => {
    try {
      expect(testCase).toEqual(expected);
    } catch (error) {
      throw error instanceof Error
        ? skipCustomFunctionInStackTrace(error, "expectArgMatch")
        : error;
    }
  };

  return { expectArgMatch };
}
