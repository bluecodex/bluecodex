import type { Arg } from "../arg/arg";
import type { IsNullableArg } from "../arg/is-nullable-arg";
import type {
  DataTypeSchema,
  DataTypeWithSchema,
} from "../data-type/data-type-schema";
import type { DataTypeToken } from "../data-type/data-type-token";
import type { Flag } from "../flag/flag";
import type { IsNullableFlag } from "../flag/is-nullable-flag";
import type { ExplodeBlueprintToken } from "./explode-blueprint-token";

/* Types */

export type BlueprintTokenExploded<
  Name extends string = string,
  Parts extends (Arg | Flag)[] = (Arg | Flag)[],
> = {
  __objectType__: "blueprint-token-exploded";
  name: Name;
  parts: Parts;
};

export type BlueprintSchema<Parts extends (Arg | Flag)[] = (Arg | Flag)[]> =
  Partial<{
    [P in Parts[number] as P["name"]]: P["type"] extends DataTypeToken
      ? DataTypeSchema<P["type"]>
      : {};
  }>;

export type Blueprint<
  Name extends string = string,
  Parts extends (Arg | Flag)[] = (Arg | Flag)[],
  Schema extends BlueprintSchema<Parts> = BlueprintSchema<Parts>,
> = {
  __objectType__: "blueprint";
  name: Name;
  parts: Parts;
  schema: Schema;
};

export type BlueprintDefinition<BlueprintToken extends string = string> =
  | BlueprintToken
  | [
      BlueprintToken,
      BlueprintSchema<ExplodeBlueprintToken<BlueprintToken>["parts"]>,
    ];

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
      ? DataTypeWithSchema<P["type"], B["schema"][P["name"]]> | null
      : DataTypeWithSchema<P["type"], B["schema"][P["name"]]>
    : P["type"];
};
