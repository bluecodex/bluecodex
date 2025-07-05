import type { Arg } from "../arg/arg";
import { type ParseArg, parseArg } from "../arg/parse-arg";
import type { Flag } from "../flag/flag";
import { type ParseFlag, parseFlag } from "../flag/parse-flag";
import type { Blueprint } from "./blueprint";

/*
 * Type parser
 */

type ParseBlueprintTokenPart<ArgOrFlagToken extends string> =
  ArgOrFlagToken extends `-${string}`
    ? ParseFlag<ArgOrFlagToken>
    : ParseArg<ArgOrFlagToken>;

type ParseBlueprintCombinedTokenParts<ArgAndFlagTokens extends string> =
  ArgAndFlagTokens extends `${infer FirstToken} ${infer RemainingTokens}`
    ? [
        ParseBlueprintTokenPart<FirstToken>,
        ...ParseBlueprintCombinedTokenParts<RemainingTokens>,
      ]
    : [ParseBlueprintTokenPart<ArgAndFlagTokens>];

export type ParseBlueprint<BlueprintToken extends string> =
  BlueprintToken extends `${infer Name} ${infer ArgAndFlagTokens}`
    ? Blueprint<Name, ParseBlueprintCombinedTokenParts<ArgAndFlagTokens>>
    : Blueprint<BlueprintToken, never>;

/*
 * Function
 */

export function parseBlueprint<BlueprintToken extends string>(
  blueprintToken: BlueprintToken,
): ParseBlueprint<BlueprintToken> {
  const [name, ...inputParts] = blueprintToken.split(" ");

  const parts: (Arg | Flag)[] = inputParts.map((part) =>
    part.startsWith("-") ? parseFlag(part) : parseArg(part),
  );

  return { __objectType__: "blueprint", name, parts } satisfies Blueprint<
    any,
    any
  > as ParseBlueprint<BlueprintToken>;
}
