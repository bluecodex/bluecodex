import { type CastData, castData } from "../data-type/cast-data";
import type { DataTypeToken } from "../data-type/data-type-constants";
import { DataTypeCastBooleanError } from "../data-type/errors/data-type-cast-boolean-error";
import type { DataTypeCastError } from "../data-type/errors/data-type-cast-error";
import { DataTypeCastNumberError } from "../data-type/errors/data-type-cast-number-error";
import {
  type IsValidDataTypeToken,
  isValidDataType,
} from "../data-type/is-valid-data-type";
import { type Arg } from "./arg";
import { ArgFallbackCastError } from "./errors/arg-fallback-cast-error";
import { InvalidArgTypeError } from "./errors/invalid-arg-type-error";

type ParseArg_Step1<Step1Token extends string> =
  // 1. fallback token
  Step1Token extends `${infer Step2Token}=${infer FallbackToken}`
    ? ParseArg_Step2<FallbackToken, Step2Token>
    : ParseArg_Step2<null, Step1Token>;

type ParseArg_Step2<
  FallbackToken extends string | null,
  Step2Token extends string,
> =
  // 2. type token
  Step2Token extends `${infer Step3Token}:${infer TypeToken}`
    ? ParseArg_Step3<FallbackToken, TypeToken, Step3Token>
    : ParseArg_Step3<FallbackToken, null, Step2Token>;

type ParseArg_Step3<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Step3Token extends string,
> =
  // 3. optional, name
  Step3Token extends `${infer Name}?`
    ? ParseArg_Step4<FallbackToken, TypeToken, true, Name>
    : ParseArg_Step4<FallbackToken, TypeToken, false, Step3Token>;

type ParseArg_Step4<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Optional extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeToken extends null ? false : true,
  Type extends
    | DataTypeToken
    | InvalidArgTypeError<Name, TypeToken & string> = TypeToken extends string
    ? IsValidDataTypeToken<TypeToken, InvalidArgTypeError<Name, TypeToken>>
    : "string",
  Fallback = Type extends DataTypeToken ? CastData<Type, FallbackToken> : null,
> =
  // 4. Combine into Arg<...>
  Arg<
    Name,
    Optional,
    Type,
    ExplicitType,
    Fallback extends DataTypeCastError
      ? ArgFallbackCastError<Name, Fallback>
      : Fallback
  >;

export type ParseArg<ArgToken extends string> = ParseArg_Step1<ArgToken>;

export function parseArg<ArgToken extends string>(
  argToken: ArgToken,
): ParseArg<ArgToken> {
  const tokenParts = argToken.split(/[:=]/);
  const explicitType = argToken.includes(":");

  const nameOptionalToken = tokenParts.shift()!;
  const typeToken = explicitType ? tokenParts.shift() : undefined;
  const fallbackToken = argToken.includes("=") ? tokenParts.shift() : undefined;

  const optional = nameOptionalToken.endsWith("?");
  const name = optional ? nameOptionalToken.slice(0, -1) : nameOptionalToken;

  const type: DataTypeToken | InvalidArgTypeError = (() => {
    if (!typeToken) return "string";
    if (isValidDataType(typeToken)) return typeToken;

    return new InvalidArgTypeError(name, typeToken);
  })();

  const fallback = (() => {
    if (typeof fallbackToken === "undefined" || type instanceof Error)
      return null;

    const value = castData({ type, input: fallbackToken });

    if (
      value instanceof DataTypeCastBooleanError ||
      value instanceof DataTypeCastNumberError
    ) {
      return new ArgFallbackCastError(name, value);
    }

    return value;
  })();

  return {
    __objectType__: "arg",
    name,
    type,
    explicitType,
    optional,
    fallback,
  } satisfies Arg<any, any, any, any> as ParseArg<ArgToken>;
}
