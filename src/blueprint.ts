import {
  type Arg,
  type ArgFromInput,
  type IsNullableArg,
  parseArg,
} from "./arg";
import type { DataTypeByName } from "./data-type";
import {
  type Flag,
  type FlagFromInput,
  type IsNullableFlag,
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

type PartFromInput<S extends string> = S extends `-${string}`
  ? FlagFromInput<S>
  : ArgFromInput<S>;

type ExtractParts<S extends string> =
  S extends `${infer ThisPart} ${infer NextPart}`
    ? [PartFromInput<ThisPart>, ...ExtractParts<NextPart>]
    : [PartFromInput<S>];

export type BlueprintFromInput<S extends string> =
  S extends `${infer Name} ${infer PartsInput}`
    ? Blueprint<Name, ExtractParts<PartsInput>>
    : Blueprint<S, never>;

type IsNullablePart<P extends Arg | Flag> = P extends Arg
  ? IsNullableArg<P>
  : P extends Flag
    ? IsNullableFlag<Flag>
    : false;

export type RecordFromBlueprint<B extends Blueprint> = {
  [P in B["parts"][number] as P["name"]]: IsNullablePart<P> extends true
    ? DataTypeByName<P["type"]> | null
    : DataTypeByName<P["type"]>;
};

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
