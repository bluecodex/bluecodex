import chalk from "chalk";

import {
  type CastData,
  type DataType,
  type DataTypeByName,
  type ValidDataType,
  castData,
  isValidDataType,
} from "./data-type";

/*
 * Types
 */

export type Flag<
  Name extends string = string,
  Short extends string | true | null = string | true | null,
  Required extends boolean = boolean,
  Type extends DataType = DataType,
  ExplicitType extends boolean = boolean,
  Fallback extends any | null = any | null,
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

type ParseLongFlag_Step1<S extends string> =
  // 1. fallback token
  S extends `${infer Part2}=${infer FallbackToken}`
    ? ParseLongFlag_Step2<FallbackToken, Part2>
    : ParseLongFlag_Step2<null, S>;

type ParseLongFlag_Step2<
  FallbackToken extends string | null,
  S extends string,
> =
  // 3. type token, explicit type
  S extends `${infer Step3}:${infer TypeToken}`
    ? ParseLongFlag_Step3<FallbackToken, TypeToken, Step3>
    : ParseLongFlag_Step3<FallbackToken, null, S>;

type ParseLongFlag_Step3<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  S extends string,
> =
  // 3. required
  S extends `${infer Part4}!`
    ? ParseLongFlag_Step4<FallbackToken, TypeToken, true, Part4>
    : ParseLongFlag_Step4<FallbackToken, TypeToken, false, S>;

type ParseLongFlag_Step4<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  S extends string,
> =
  // 4. short, name
  S extends `${infer Name}(${infer ShortToken}`
    ? ShortToken extends `-${infer Short}${string})`
      ? ParseLongFlag_Step5<FallbackToken, TypeToken, Required, Short, Name>
      : ParseLongFlag_Step5<FallbackToken, TypeToken, Required, null, Name>
    : ParseLongFlag_Step5<FallbackToken, TypeToken, Required, null, S>;

type ParseLongFlag_Step5<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  Short extends string | null,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeToken extends null ? false : true,
  Type extends DataType = ValidDataType<TypeToken, "boolean">,
> =
  // 5. Combine into Flag<...>
  Flag<
    Name,
    Short,
    Required,
    Type,
    ExplicitType,
    CastData<Type, FallbackToken>
  >;

/*
 * Internal parse short types
 */

type ParseShortFlag_Step1<S extends string> =
  // 1. fallback token
  S extends `${infer Part2}=${infer FallbackToken}`
    ? ParseShortFlag_Step2<FallbackToken, Part2>
    : ParseShortFlag_Step2<null, S>;

type ParseShortFlag_Step2<
  FallbackToken extends string | null,
  S extends string,
> =
  // 2. type token
  S extends `${infer Part4}:${infer TypeToken}`
    ? ParseShortFlag_Step3<FallbackToken, TypeToken, Part4>
    : ParseShortFlag_Step3<FallbackToken, null, S>;

type ParseShortFlag_Step3<
  // 3. required, name
  FallbackToken extends string | null,
  TypeToken extends string | null,
  S extends string,
> = S extends `${infer Name}${string}!`
  ? ParseShortFlag_Step4<FallbackToken, TypeToken, true, Name>
  : ParseShortFlag_Step4<FallbackToken, TypeToken, false, S>;

type ParseShortFlag_Step4<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Required extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeToken extends null ? false : true,
  Type extends DataType = ValidDataType<TypeToken, "boolean">,
> =
  // 4. Combine into Flag<...>
  Flag<Name, true, Required, Type, ExplicitType, CastData<Type, FallbackToken>>;

/*
 * Parse types
 */

export type ParseFlag<S extends string> = S extends `--${infer Long_Part1}`
  ? ParseLongFlag_Step1<Long_Part1>
  : S extends `-${infer Short_Part1}`
    ? ParseShortFlag_Step1<Short_Part1>
    : never;

/*
 * Errors
 */

export class MissingRequiredFlagError extends Error {
  flag: Flag;

  constructor(flag: Flag) {
    super();
    this.flag = flag;
  }

  get message() {
    return `Flag ${chalk.bold(`${this.flag.name}:${this.flag.type}`)} is not optional and was not provided.`;
  }
}

export class InvalidFlagInputError extends Error {
  flag: Flag;
  input: string;

  constructor(flag: Flag, input: string) {
    super();
    this.flag = flag;
    this.input = input;
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

export function parseFlag<S extends string>(flagToken: S): ParseFlag<S> {
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

  const type: DataType =
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
  } satisfies Flag<any, any, any, any, any> as ParseFlag<S>;
}

export function castFlag<F extends Flag>({
  flag,
  input,
}: {
  flag: F;
  input: string;
}): DataTypeByName<F["type"]> {
  if (flag.required && !input) {
    throw new MissingRequiredFlagError(flag);
  }

  try {
    return castData({ type: flag.type, input }) as DataTypeByName<F["type"]>;
  } catch {
    throw new InvalidFlagInputError(flag, input);
  }
}

export function formatFlag(flag: Flag) {
  const parts: string[] = [];

  parts.push(chalk(`${flag.short === true ? "-" : "--"}${flag.name}`));
  if (typeof flag.short === "string") parts.push(chalk.dim(`(-${flag.short})`));
  if (flag.explicitType) parts.push(chalk.dim(`:${flag.type}`));
  if (flag.fallback !== null) parts.push(chalk.dim(`=${flag.fallback}`));

  return parts.join("");
}
