import type { DataTypeToken } from "../data-type/data-type-constants";
import type { DataTypeCastError } from "../data-type/errors/data-type-cast-error";
import type { ArgFallbackCastError } from "./errors/arg-fallback-cast-error";
import type { InvalidArgTypeError } from "./errors/invalid-arg-type-error";

export type Arg<
  Name extends string = string,
  Optional extends boolean = boolean,
  Type extends DataTypeToken | InvalidArgTypeError<Name, string> =
    | DataTypeToken
    | InvalidArgTypeError<Name, string>,
  ExplicitType extends boolean = boolean,
  Fallback extends
    | any
    | null
    | ArgFallbackCastError<Name, DataTypeCastError> = any,
> = {
  __objectType__: "arg";
  name: Name;
  optional: Optional;
  type: Type;
  explicitType: ExplicitType;
  fallback: Fallback;
};
