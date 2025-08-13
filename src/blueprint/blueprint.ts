import type { Arg, ValidArg } from "../arg/arg";
import type { IsNullableArg } from "../arg/is-nullable-arg";
import type {
  DataTypeSchema,
  DataTypeWithSchema,
} from "../data-type/data-type-schema";
import type { DataTypeToken } from "../data-type/data-type-token";
import type { Flag, ValidFlag } from "../flag/flag";
import type { IsNullableFlag } from "../flag/is-nullable-flag";
import type { ExplodeBlueprintToken } from "./explode-blueprint-token";

/* Types */

export type BlueprintTokenExploded<
  Name extends string = string,
  Fields extends (Arg | Flag)[] = (Arg | Flag)[],
> = {
  __objectType__: "blueprint-token-exploded";
  name: Name;
  fields: Fields;
};

export type BlueprintSchema<Fields extends (Arg | Flag)[] = (Arg | Flag)[]> =
  Partial<{
    [F in Fields[number] as F["name"]]: F["type"] extends DataTypeToken
      ? DataTypeSchema<F["type"]>
      : {};
  }>;

export type Blueprint<
  Name extends string = string,
  Fields extends (Arg | Flag)[] = (Arg | Flag)[],
  Schema extends BlueprintSchema<Fields> = BlueprintSchema<Fields>,
> = {
  __objectType__: "blueprint";
  name: Name;
  fields: Fields;
  schema: Schema;
};

export type ValidBlueprint<
  Name extends string = string,
  Fields extends (ValidArg | ValidFlag)[] = (ValidArg | ValidFlag)[],
  Schema extends BlueprintSchema<Fields> = BlueprintSchema<Fields>,
> = Blueprint<Name, Fields, Schema>;

export type BlueprintDefinition<BlueprintToken extends string = string> =
  | BlueprintToken
  | [
      BlueprintToken,
      BlueprintSchema<ExplodeBlueprintToken<BlueprintToken>["fields"]>,
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
  [F in B["fields"][number] as F["name"]]: F["type"] extends DataTypeToken
    ? IsNullablePart<F> extends true
      ? DataTypeWithSchema<F["type"], B["schema"][F["name"]]> | null
      : DataTypeWithSchema<F["type"], B["schema"][F["name"]]>
    : F["type"];
};
