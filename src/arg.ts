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
 * Exported types
 */

export type Arg<
  Name extends string = string,
  Optional extends boolean = boolean,
  Type extends DataType = DataType,
  ExplicitType extends boolean = boolean,
  Fallback extends any | null = any | null,
> = {
  name: Name;
  optional: Optional;
  type: Type;
  explicitType: ExplicitType;
  fallback: Fallback;
};

export type IsNullableArg<A extends Arg> = A["optional"] extends true
  ? A["fallback"] extends null
    ? true
    : false
  : false;

/*
 * Internal parse types
 */

type ParseArg_Step1<S extends string> =
  // 1. fallback token
  S extends `${infer Part2}=${infer FallbackToken}`
    ? ParseArg_Step2<FallbackToken, Part2>
    : ParseArg_Step2<null, S>;

type ParseArg_Step2<FallbackToken extends string | null, S extends string> =
  // 2. type token
  S extends `${infer Part3}:${infer TypeToken}`
    ? ParseArg_Step3<FallbackToken, TypeToken, Part3>
    : ParseArg_Step3<FallbackToken, null, S>;

type ParseArg_Step3<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  S extends string,
> =
  // 3. optional, name
  S extends `${infer Name}?`
    ? ParseArg_Step4<FallbackToken, TypeToken, true, Name>
    : ParseArg_Step4<FallbackToken, TypeToken, false, S>;

type ParseArg_Step4<
  FallbackToken extends string | null,
  TypeToken extends string | null,
  Optional extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeToken extends null ? false : true,
  Type extends DataType = ValidDataType<TypeToken, "string">,
> =
  // 4. Combine into Arg<...>
  Arg<Name, Optional, Type, ExplicitType, CastData<Type, FallbackToken>>;

/*
 * Parse types
 */

export type ParseArg<S extends string> = ParseArg_Step1<S>;

/*
 * Errors
 */

export class MissingRequiredArgError extends Error {
  arg: Arg;

  constructor(arg: Arg) {
    super();
    this.arg = arg;
  }

  get message() {
    return `Arg ${chalk.bold(`${this.arg.name}:${this.arg.type}`)} is not optional and was not provided.`;
  }
}

export class InvalidArgInputError extends Error {
  arg: Arg;
  input: string;

  constructor(arg: Arg, input: string) {
    super();
    this.arg = arg;
    this.input = input;
  }

  get message() {
    return `Invalid input ${chalk.redBright(this.input)} for arg ${chalk.bold(`${this.arg.name}:${this.arg.type}`)}`;
  }
}

/*
 * Functions
 */

export function parseArg<S extends string>(argToken: S): ParseArg<S> {
  const parts = argToken.split(/[:=]/);
  const explicitType = argToken.includes(":");

  const nameOptionalToken = parts.shift()!;
  const typeToken = explicitType ? parts.shift() : undefined;
  const fallbackToken = argToken.includes("=") ? parts.shift() : undefined;

  const optional = nameOptionalToken.endsWith("?");
  const name = optional ? nameOptionalToken.slice(0, -1) : nameOptionalToken;

  const type: DataType =
    typeToken && isValidDataType(typeToken) ? typeToken : "string";

  const fallback =
    typeof fallbackToken === "undefined"
      ? null
      : castData({ type, input: fallbackToken });

  return {
    name,
    type,
    explicitType,
    optional,
    fallback,
  } satisfies Arg<any, any, any, any> as ParseArg<S>;
}

export function castArg<A extends Arg>({
  arg,
  input,
}: {
  arg: A;
  input: string;
}): DataTypeByName<A["type"]> {
  if (!arg.optional && !input) throw new MissingRequiredArgError(arg);

  try {
    return castData({ type: arg.type, input }) as DataTypeByName<A["type"]>;
  } catch {
    throw new InvalidArgInputError(arg, input);
  }
}

export function formatArg(arg: Arg) {
  const parts: string[] = [];

  parts.push(arg.optional ? chalk.dim(`${arg.name}?`) : arg.name);
  if (arg.explicitType) parts.push(chalk.dim(`:${arg.type}`));
  if (arg.fallback !== null) parts.push(chalk.dim(`=${arg.fallback}`));

  return parts.join("");
}
