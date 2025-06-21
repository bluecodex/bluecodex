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

type ParsePart<S extends string> = S extends `-${string}`
  ? ParseFlag<S>
  : ParseArg<S>;

type ParseCombinedParts<S extends string> =
  S extends `${infer ThisPart} ${infer NextPart}`
    ? [ParsePart<ThisPart>, ...ParseCombinedParts<NextPart>]
    : [ParsePart<S>];

export type ParseBlueprint<S extends string> =
  S extends `${infer Name} ${infer PartsInput}`
    ? Blueprint<Name, ParseCombinedParts<PartsInput>>
    : Blueprint<S, never>;

/*
 * Functions
 */

export function isArgPart(part: Arg | Flag): part is Arg {
  return "required" in part;
}

export function isFlagPart(part: Arg | Flag): part is Flag {
  return !isArgPart(part);
}

export function blueprint<S extends string>(input: S): Blueprint<S> {
  const [name, ...inputParts] = input.split(" ");

  const parts: (Arg | Flag)[] = inputParts.map((part) =>
    part.startsWith("-") ? parseFlag(part) : parseArg(part),
  );

  return { name, parts } as Blueprint<S>;
}
