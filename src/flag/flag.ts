import type { DataTypeToken } from "../data-type/data-type-token";
import type { DataTypeCastError } from "../data-type/errors/data-type-cast-error";
import type { FlagFallbackCastError } from "./errors/flag-fallback-cast-error";
import type { FlagShortHasMoreThanOneCharError } from "./errors/flag-short-has-more-than-one-char-error";
import type { FlagShortMalformattedError } from "./errors/flag-short-malformed-error";
import type { InvalidFlagTypeError } from "./errors/invalid-flag-type-error";

export type Flag<
  Name extends string = string,
  Short extends
    | string
    | true
    | null
    | FlagShortMalformattedError<Name, string>
    | FlagShortHasMoreThanOneCharError<Name, string> =
    | string
    | true
    | null
    | FlagShortMalformattedError<Name, string>
    | FlagShortHasMoreThanOneCharError<Name, string>,
  Required extends boolean = boolean,
  Type extends DataTypeToken | InvalidFlagTypeError<Name, string> =
    | DataTypeToken
    | InvalidFlagTypeError<Name, string>,
  ExplicitType extends boolean = boolean,
  Fallback extends
    | any
    | null
    | FlagFallbackCastError<Name, DataTypeCastError> = any | null,
> = {
  __objectType__: "flag";
  name: Name;
  short: Short;
  required: Required;
  type: Type;
  explicitType: ExplicitType;
  fallback: Fallback;
};

export type ValidFlag<
  Name extends string = string,
  Short extends string | true | null = string | true | null,
  Required extends boolean = boolean,
  Type extends DataTypeToken = DataTypeToken,
  ExplicitType extends boolean = boolean,
  Fallback extends any | null = any | null,
> = Flag<Name, Short, Required, Type, ExplicitType, Fallback>;
