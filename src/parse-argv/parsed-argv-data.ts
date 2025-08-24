import type { Arg } from "../arg/arg";
import type { IsNullableArg } from "../arg/is-nullable-arg";
import type { Blueprint } from "../blueprint/blueprint";
import type { CommandSchema } from "../command/command";
import type { DataType } from "../data-type/data-type";
import type { DataTypeToken } from "../data-type/data-type-token";
import type { Flag } from "../flag/flag";
import type { IsNullableFlag } from "../flag/is-nullable-flag";

type IsNullableField<P extends Arg | Flag> = P extends Arg
  ? IsNullableArg<P>
  : P extends Flag
    ? IsNullableFlag<P>
    : false;

type SelfOrValue<V> = V extends { value: infer ObjectValue } ? ObjectValue : V;

type MaybeNullable<Nullable, V> = Nullable extends true ? V | null : V;

export type ParsedArgvData<
  B extends Blueprint = Blueprint,
  S extends CommandSchema<B> = CommandSchema<B>,
> = {
  [F in B["fields"][number] as F["name"]]: MaybeNullable<
    IsNullableField<F>,
    S[F["name"]] extends {
      validate: Array<infer Value> | ReadonlyArray<infer Value>;
    }
      ? SelfOrValue<Value>
      : F["type"] extends DataTypeToken
        ? DataType<F["type"]>
        : F["type"]
  >;
};
