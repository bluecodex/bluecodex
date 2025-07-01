import chalk from "chalk";

import {
  type CastData,
  type DataTypeByToken,
  type DataTypeCastError,
  type DataTypeToken,
  type ValidDataTypeToken,
  castData,
  isValidDataType,
} from "./data-type";

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
  name: Name;
  short: Short;
  required: Required;
  type: Type;
  explicitType: ExplicitType;
  fallback: Fallback;
};

/*
 * Utility types
 */

export type IsNullableFlag<F extends Flag> = F["type"] extends "boolean"
  ? false
  : F["required"] extends true
    ? false
    : F["fallback"] extends null
      ? true
      : false;

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
    ? ValidDataTypeToken<TypeToken, InvalidFlagTypeError<Name, TypeToken>>
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
> = Step3Token extends `${infer Name}${string}!`
  ? ParseShortFlag_Step4<FallbackToken, TypeToken, true, Name>
  : ParseShortFlag_Step4<FallbackToken, TypeToken, false, Step3Token>;

type ParseShortFlag_Step4<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeToken extends null ? false : true,
  Type extends
    | DataTypeToken
    | InvalidFlagTypeError<Name, TypeToken & string> = TypeToken extends string
    ? ValidDataTypeToken<TypeToken, InvalidFlagTypeError<Name, TypeToken>>
    : "boolean",
  Fallback = Type extends DataTypeToken ? CastData<Type, FallbackToken> : null,
> =
  // 4. Combine into Flag<...>
  Flag<
    Name,
    true,
    Required,
    Type,
    ExplicitType,
    Fallback extends DataTypeCastError
      ? FlagFallbackCastError<Name, Fallback>
      : Fallback
  >;

/*
 * Type parser
 */

export type ParseFlag<FlagToken extends string> =
  FlagToken extends `--${infer Long_Part1}`
    ? ParseLongFlag_Step1<Long_Part1>
    : FlagToken extends `-${infer Short_Part1}`
      ? ParseShortFlag_Step1<Short_Part1>
      : never;

/*
 * Errors
 */

export class InvalidFlagTypeError<
  FlagName extends string,
  TypeToken extends string,
> extends Error {
  constructor(
    readonly flagName: FlagName,
    readonly typeToken: TypeToken,
  ) {
    super();
  }

  get message() {
    return `Invalid type "${this.typeToken}" for flag "${this.flagName}"`;
  }
}

export class FlagShortMalformattedError<
  FlagName extends string,
  ShortToken extends string,
> extends Error {
  constructor(
    readonly flagName: FlagName,
    readonly shortToken: ShortToken,
  ) {
    super();
  }

  get message() {
    return `Invalid short format "${this.shortToken}" for flag "${this.flagName}"`;
  }
}

export class FlagShortHasMoreThanOneCharError<
  FlagName extends string,
  ShortToken extends string,
> extends Error {
  constructor(
    readonly flagName: FlagName,
    readonly shortToken: ShortToken,
  ) {
    super();
  }

  get message() {
    return `Flag short can only have one character, given "${this.shortToken}" for flag "${this.flagName}"`;
  }
}

export class FlagFallbackCastError<
  FlagName extends string,
  Err extends DataTypeCastError,
> extends Error {
  constructor(
    readonly flagName: FlagName,
    readonly error: Err,
  ) {
    super();
  }

  get message() {
    return `In flag "${this.flagName}": ${this.error.message}`;
  }
}

export class MissingRequiredFlagError extends Error {
  constructor(readonly flag: Flag) {
    super();
  }

  get message() {
    return `Flag ${chalk.bold(`${this.flag.name}:${this.flag.type}`)} is not optional and was not provided.`;
  }
}

export class InvalidFlagInputError extends Error {
  constructor(
    readonly flag: Flag,
    readonly input: string,
  ) {
    super();
  }

  get message() {
    return `Invalid input ${chalk.redBright(this.input)} for flag ${chalk.bold(`${this.flag.name}:${this.flag.type}`)}`;
  }
}

/*
 * Functions
 */

export function extractFlagShortFromNameInput(nameShortToken: string) {
  const index = nameShortToken.indexOf("(");
  if (index === -1) return { name: nameShortToken, short: null };

  const name = nameShortToken.slice(0, index);
  const shortToken = nameShortToken.slice(index);
  const short = shortToken[2];

  const isValidShortLetter = /^[a-zA-Z]$/.test(short);
  const isValidShort =
    shortToken.startsWith("(-") &&
    shortToken.endsWith(")") &&
    isValidShortLetter;

  return { name, short: isValidShort ? short : null };
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
      ? { name: nameToken[0], short: true }
      : extractFlagShortFromNameInput(nameToken);

  const type: DataTypeToken =
    typeToken && isValidDataType(typeToken) ? typeToken : "boolean";

  const fallback =
    typeof fallbackToken === "undefined"
      ? null
      : castData({ type, input: fallbackToken });

  return {
    name,
    short,
    type,
    explicitType,
    required,
    fallback,
  } satisfies Flag<any, any, any, any, any> as ParseFlag<FlagToken>;
}

export function castFlag<F extends Flag>({
  flag,
  input,
}: {
  flag: F;
  input: string;
}): DataTypeByToken<F["type"] & DataTypeToken> {
  if (flag.type instanceof InvalidFlagTypeError) {
    throw flag.type;
  }

  if (flag.required && !input) {
    throw new MissingRequiredFlagError(flag);
  }

  try {
    return castData({ type: flag.type, input }) as DataTypeByToken<
      F["type"] & DataTypeToken
    >;
  } catch {
    throw new InvalidFlagInputError(flag, input);
  }
}

export function formatFlag(flag: Flag) {
  const formattedParts: string[] = [];

  formattedParts.push(chalk(`${flag.short === true ? "-" : "--"}${flag.name}`));

  if (typeof flag.short === "string")
    formattedParts.push(chalk.dim(`(-${flag.short})`));

  if (flag.explicitType) formattedParts.push(chalk.dim(`:${flag.type}`));

  if (flag.fallback !== null)
    formattedParts.push(chalk.dim(`=${flag.fallback}`));

  return formattedParts.join("");
}
