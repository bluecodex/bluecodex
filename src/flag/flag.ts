import type { DataTypeToken } from "../data-type/data-type-constants";
import type { DataTypeCastError } from "../data-type/errors/data-type-cast-error";
import type { FlagFallbackCastError } from "./errors/flag-fallback-cast-error";
import type { FlagShortHasMoreThanOneCharError } from "./errors/flag-short-has-more-than-one-char-error";
import type { FlagShortMalformattedError } from "./errors/flag-short-malformed-error";
import type { InvalidFlagTypeError } from "./errors/invalid-flag-type-error";

/*
 * Types
 */

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
