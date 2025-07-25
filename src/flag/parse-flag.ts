import { type CastData, castData } from "../data-type/cast-data";
import type { DataTypeToken } from "../data-type/data-type-constants";
import { DataTypeCastBooleanError } from "../data-type/errors/data-type-cast-boolean-error";
import type { DataTypeCastError } from "../data-type/errors/data-type-cast-error";
import { DataTypeCastNumberError } from "../data-type/errors/data-type-cast-number-error";
import {
  type IsValidDataTypeToken,
  isValidDataType,
} from "../data-type/is-valid-data-type";
import { FlagFallbackCastError } from "./errors/flag-fallback-cast-error";
import { FlagShortHasMoreThanOneCharError } from "./errors/flag-short-has-more-than-one-char-error";
import { FlagShortMalformattedError } from "./errors/flag-short-malformed-error";
import { InvalidFlagTypeError } from "./errors/invalid-flag-type-error";
import { type Flag } from "./flag";

/*
 * Internal parse long types
 */

type ParseLongFlag_Step1<Step1Token extends string> =
  // 1. fallback token
  Step1Token extends `${infer Step2Token}=${infer FallbackToken}`
    ? ParseLongFlag_Step2<FallbackToken, Step2Token>
    : ParseLongFlag_Step2<null, Step1Token>;

type ParseLongFlag_Step2<
  FallbackToken extends string | null,
  Step2Token extends string,
> =
  // 3. type token, explicit type
  Step2Token extends `${infer Step3Token}:${infer TypeToken}`
    ? ParseLongFlag_Step3<FallbackToken, TypeToken, Step3Token>
    : ParseLongFlag_Step3<FallbackToken, null, Step2Token>;

type ParseLongFlag_Step3<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Step3Token extends string,
> =
  // 3. required
  Step3Token extends `${infer Step4Token}!`
    ? ParseLongFlag_Step4<FallbackToken, TypeToken, true, Step4Token>
    : ParseLongFlag_Step4<FallbackToken, TypeToken, false, Step3Token>;

type ParseLongFlag_Step4<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  Step4Token extends string,
> =
  // 4. short, name
  Step4Token extends `${infer Name}(${infer ShortToken}`
    ? ShortToken extends `-${infer Short}${infer ExtraChars})`
      ? ExtraChars extends ""
        ? ParseLongFlag_Step5<FallbackToken, TypeToken, Required, Short, Name>
        : ParseLongFlag_Step5<
            FallbackToken,
            TypeToken,
            Required,
            FlagShortHasMoreThanOneCharError<Name, `(${ShortToken}`>,
            Name
          >
      : ParseLongFlag_Step5<
          FallbackToken,
          TypeToken,
          Required,
          FlagShortMalformattedError<Name, `(${ShortToken}`>,
          Name
        >
    : ParseLongFlag_Step5<FallbackToken, TypeToken, Required, null, Step4Token>;

type ParseLongFlag_Step5<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  Short extends string | null | FlagShortMalformattedError<Name, string>,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeToken extends null ? false : true,
  Type extends
    | DataTypeToken
    | InvalidFlagTypeError<Name, TypeToken & string> = TypeToken extends string
    ? IsValidDataTypeToken<TypeToken, InvalidFlagTypeError<Name, TypeToken>>
    : "boolean",
  Fallback = Type extends DataTypeToken ? CastData<Type, FallbackToken> : null,
> =
  // 5. Combine into Flag<...>
  Flag<
    Name,
    Short,
    Required,
    Type,
    ExplicitType,
    Fallback extends DataTypeCastError
      ? FlagFallbackCastError<Name, Fallback>
      : Fallback
  >;

/*
 * Internal parse short types
 */

type ParseShortFlag_Step1<Step1Token extends string> =
  // 1. fallback token
  Step1Token extends `${infer Step2Token}=${infer FallbackToken}`
    ? ParseShortFlag_Step2<FallbackToken, Step2Token>
    : ParseShortFlag_Step2<null, Step1Token>;

type ParseShortFlag_Step2<
  FallbackToken extends string | null,
  Step2Token extends string,
> =
  // 2. type token
  Step2Token extends `${infer Step3Token}:${infer TypeToken}`
    ? ParseShortFlag_Step3<FallbackToken, TypeToken, Step3Token>
    : ParseShortFlag_Step3<FallbackToken, null, Step2Token>;

type ParseShortFlag_Step3<
  // 3. required, name
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Step3Token extends string,
> = Step3Token extends `${infer NameToken}!`
  ? ParseShortFlag_Step4<FallbackToken, TypeToken, true, NameToken>
  : ParseShortFlag_Step4<FallbackToken, TypeToken, false, Step3Token>;

type ParseShortFlag_Step4<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  NameToken extends string,
> =
  // 4. Check if name has extra chars
  NameToken extends `${infer Name}${infer ExtraChars}`
    ? ExtraChars extends ""
      ? ParseShortFlag_Step5<FallbackToken, TypeToken, Required, true, Name>
      : ParseShortFlag_Step5<
          FallbackToken,
          TypeToken,
          Required,
          FlagShortHasMoreThanOneCharError<Name, NameToken>,
          Name
        >
    : never;

type ParseShortFlag_Step5<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  Short extends true | FlagShortHasMoreThanOneCharError<Name, string>,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeToken extends null ? false : true,
  Type extends
    | DataTypeToken
    | InvalidFlagTypeError<Name, TypeToken & string> = TypeToken extends string
    ? IsValidDataTypeToken<TypeToken, InvalidFlagTypeError<Name, TypeToken>>
    : "boolean",
  Fallback = Type extends DataTypeToken ? CastData<Type, FallbackToken> : null,
> =
  // 5. Combine into Flag<...>
  Flag<
    Name,
    Short,
    Required,
    Type,
    ExplicitType,
    Fallback extends DataTypeCastError
      ? FlagFallbackCastError<Name, Fallback>
      : Fallback
  >;

export type ParseFlag<FlagToken extends string> =
  FlagToken extends `--${infer Long_Part1}`
    ? ParseLongFlag_Step1<Long_Part1>
    : FlagToken extends `-${infer Short_Part1}`
      ? ParseShortFlag_Step1<Short_Part1>
      : never;

/*
 * Function
 */

function extractFlagShortFromNameInput(nameShortToken: string): {
  name: string;
  short:
    | string
    | null
    | FlagShortMalformattedError
    | FlagShortHasMoreThanOneCharError;
} {
  const index = nameShortToken.indexOf("(");
  if (index === -1) return { name: nameShortToken, short: null };

  const name = nameShortToken.slice(0, index);
  const shortToken = nameShortToken.slice(index);
  const short = shortToken[2];

  if (shortToken.length > 4) {
    return {
      name,
      short: new FlagShortHasMoreThanOneCharError(name, shortToken),
    };
  }

  const isShortALetter = /^[a-zA-Z]$/.test(short);
  const isValidShort =
    shortToken.startsWith("(-") && shortToken.endsWith(")") && isShortALetter;

  return {
    name,
    short: isValidShort
      ? short
      : new FlagShortMalformattedError(name, shortToken),
  };
}

export function parseFlag<FlagToken extends string>(
  flagToken: FlagToken,
): ParseFlag<FlagToken> {
  const dashCount = flagToken[1] === "-" ? 2 : 1;

  const parts = flagToken.slice(dashCount).split(/[:=]/);
  const explicitType = flagToken.includes(":");

  const nameRequiredToken = parts.shift()!;
  const typeToken = explicitType ? parts.shift() : undefined;
  const fallbackToken = flagToken.includes("=") ? parts.shift() : undefined;

  const required = nameRequiredToken.endsWith("!");
  const nameToken = required
    ? nameRequiredToken.slice(0, -1)
    : nameRequiredToken;

  const { name, short } =
    dashCount === 1
      ? {
          name: nameToken[0],
          short:
            nameToken.length === 1
              ? true
              : new FlagShortHasMoreThanOneCharError(nameToken[0], nameToken),
        }
      : extractFlagShortFromNameInput(nameToken);

  const type: DataTypeToken | InvalidFlagTypeError = (() => {
    if (!typeToken) return "boolean";
    if (isValidDataType(typeToken)) return typeToken;

    return new InvalidFlagTypeError(name, typeToken);
  })();

  const fallback = (() => {
    if (typeof fallbackToken === "undefined" || type instanceof Error)
      return null;

    try {
      return castData({ type, input: fallbackToken });
    } catch (error) {
      if (
        error instanceof DataTypeCastBooleanError ||
        error instanceof DataTypeCastNumberError
      ) {
        return new FlagFallbackCastError(name, error);
      }
    }
  })();

  return {
    __objectType__: "flag",
    name,
    short,
    type,
    explicitType,
    required,
    fallback,
  } satisfies Flag<any, any, any, any, any> as ParseFlag<FlagToken>;
}
