import type { Arg } from "../arg/arg";
import type { IsNullableArg } from "../arg/is-nullable-arg";
import type { Blueprint } from "../blueprint/blueprint";
import type { CommandSchema } from "../command/command";
import type {
  DataTypeSchema,
  DataTypeWithSchema,
} from "../data-type/data-type-schema";
import type { DataTypeToken } from "../data-type/data-type-token";
import type { Flag } from "../flag/flag";
import type { IsNullableFlag } from "../flag/is-nullable-flag";

type IsNullableField<P extends Arg | Flag> = P extends Arg
  ? IsNullableArg<P>
  : P extends Flag
    ? IsNullableFlag<P>
    : false;

export type ParsedArgvData<B extends Blueprint, CS extends CommandSchema<B>> = {
  [F in B["fields"][number] as F["name"]]: F["type"] extends DataTypeToken
    ? IsNullableField<F> extends true
      ? DataTypeWithSchema<
          F["type"],
          CS[F["name"]] extends DataTypeSchema<F["type"]>
            ? CS[F["name"]]
            : undefined
        > | null
      : DataTypeWithSchema<
          F["type"],
          CS[F["name"]] extends DataTypeSchema<F["type"]>
            ? CS[F["name"]]
            : undefined
        >
    : F["type"];
};
