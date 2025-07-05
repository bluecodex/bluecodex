import type { Arg } from "../arg/arg";
import type { IsNullableArg } from "../arg/is-nullable-arg";
import type {
  DataTypeByToken,
  DataTypeToken,
} from "../data-type/data-type-constants";
import type { Flag } from "../flag/flag";
import type { IsNullableFlag } from "../flag/is-nullable-flag";

/* Types */

export type Blueprint<
  Name extends string = string,
  Parts extends (Arg | Flag)[] = (Arg | Flag)[],
> = {
  __objectType__: "blueprint";
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
  [P in B["parts"][number] as P["name"]]: P["type"] extends DataTypeToken
    ? IsNullablePart<P> extends true
      ? DataTypeByToken<P["type"]> | null
      : DataTypeByToken<P["type"]>
    : P["type"];
};
