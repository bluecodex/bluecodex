import { type Arg, type IsNullableArg, type ParseArg, parseArg } from "./arg";
import type { DataTypeByName } from "./data-type";
import {
  type Flag,
  type IsNullableFlag,
  type ParseFlag,
  parseFlag,
} from "./flag";

/* Types */

export type Blueprint<
  Name extends string = string,
  Parts extends (Arg | Flag)[] = (Arg | Flag)[],
> = {
  name: Name;
  parts: Parts;
};

/*
 * Type utilities
 */

type IsNullablePart<P extends Arg | Flag> = P extends Arg
  ? IsNullableArg<P>
  : P extends Flag
    ? IsNullableFlag<P>
    : false;

export type RecordFromBlueprint<B extends Blueprint> = {
  [P in B["parts"][number] as P["name"]]: IsNullablePart<P> extends true
    ? DataTypeByName<P["type"]> | null
    : DataTypeByName<P["type"]>;
};

/*
 * Parse types
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
 * Functions
 */

export function isArg(part: Arg | Flag): part is Arg {
  return !isFlag(part);
}

export function isFlag(part: Arg | Flag): part is Flag {
  return "short" in part;
}

export function parseBlueprint<BlueprintToken extends string>(
  blueprintToken: BlueprintToken,
): ParseBlueprint<BlueprintToken> {
  const [name, ...inputParts] = blueprintToken.split(" ");

  const parts: (Arg | Flag)[] = inputParts.map((part) =>
    part.startsWith("-") ? parseFlag(part) : parseArg(part),
  );

  return { name, parts } satisfies Blueprint<
    any,
    any
  > as ParseBlueprint<BlueprintToken>;
}
