import { expect } from "vitest";

import { type Blueprint } from "../../../../src/blueprint/blueprint";
import {
  type ParseBlueprint,
  parseBlueprint,
} from "../../../../src/blueprint/parse-blueprint";
import { skipCustomFunctionInStackTrace } from "../../utils/test-error-utils";

// Ensure the blueprint is passed with `as const` to avoid attribute types being too broad
type IsLiteralBlueprint<B extends Blueprint> = B["name"] extends `${infer _}`
  ? B
  : never;

/**
 * Utility for testing `parseBlueprint`.
 *
 * It returns a function that can be used to assert multiple times the
 * given `blueprintToken` returns proper values and types.
 */
export function createParseBlueprintMatcher<B extends Blueprint>(
  expected: B & IsLiteralBlueprint<B>,
) {
  const expectParseBlueprintMatch = <BlueprintToken extends string>(
    blueprintToken: BlueprintToken &
      (ParseBlueprint<BlueprintToken> extends B ? unknown : never),
  ) => {
    try {
      expect(parseBlueprint(blueprintToken)).toEqual(expected);
    } catch (error) {
      throw error instanceof Error
        ? skipCustomFunctionInStackTrace(error, "expectParseBlueprintMatch")
        : error;
    }
  };

  return { expectParseBlueprintMatch };
}
