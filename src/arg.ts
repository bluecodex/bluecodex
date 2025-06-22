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
 * Internal type parser utils
 */

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
  Type extends DataType = ValidDataType<TypeToken, "string">,
> =
  // 4. Combine into Arg<...>
  Arg<Name, Optional, Type, ExplicitType, CastData<Type, FallbackToken>>;

/*
 * Type parser
 */

export type ParseArg<ArgToken extends string> = ParseArg_Step1<ArgToken>;

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
  } satisfies Arg<any, any, any, any> as ParseArg<ArgToken>;
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
  const formattedParts: string[] = [];

  formattedParts.push(arg.optional ? chalk.dim(`${arg.name}?`) : arg.name);
  if (arg.explicitType) formattedParts.push(chalk.dim(`:${arg.type}`));
  if (arg.fallback !== null) formattedParts.push(chalk.dim(`=${arg.fallback}`));

  return formattedParts.join("");
}
