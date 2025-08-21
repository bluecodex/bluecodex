import { expect } from "vitest";

import { type Alias } from "../../../../src/alias/alias";
import { type ParseAlias, parseAlias } from "../../../../src/alias/parse-alias";
import { skipCustomFunctionInStackTrace } from "../../utils/test-error-utils";

// Ensure the alias is passed with `as const` to avoid attribute types being too broad
type IsLiteralAlias<A extends Alias> = A["name"] extends `${infer _}`
  ? A
  : never;

/**
 * Utility for testing `parseAlias`.
 *
 * It returns a function that can be used to assert multiple times the
 * given `aliasToken` returns proper values and types.
 */
export function createParseAliasMatcher<A extends Alias>(expected: A & IsLiteralAlias<A>) {
  const expectParseAliasMatch = <AliasToken extends string>(
    aliasToken: AliasToken &
      (ParseAlias<AliasToken> extends A ? unknown : never)
  ) => {
    try {
      expect(parseAlias(aliasToken)).toEqual(expected);
    } catch (error) {
      throw error instanceof Error
        ? skipCustomFunctionInStackTrace(error, "expectParseAliasMatch")
        : error;
    }
  };

  return { expectParseAliasMatch };
}
