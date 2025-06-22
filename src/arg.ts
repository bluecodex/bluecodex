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
  // 1. fallback spec
  S extends `${infer Part2}=${infer FallbackSpec}`
    ? ParseArg_Step2<FallbackSpec, Part2>
    : ParseArg_Step2<null, S>;

type ParseArg_Step2<FallbackSpec extends string | null, S extends string> =
  // 2. type spec
  S extends `${infer Part3}:${infer TypeSpec}`
    ? ParseArg_Step3<FallbackSpec, TypeSpec, Part3>
    : ParseArg_Step3<FallbackSpec, null, S>;

type ParseArg_Step3<
  FallbackSpec extends string | null,
  TypeSpec extends string | null,
  S extends string,
> =
  // 3. optional, name
  S extends `${infer Name}?`
    ? ParseArg_Step4<FallbackSpec, TypeSpec, true, Name>
    : ParseArg_Step4<FallbackSpec, TypeSpec, false, S>;

type ParseArg_Step4<
  FallbackSpec extends string | null,
  TypeSpec extends string | null,
  Optional extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeSpec extends null ? false : true,
  Type extends DataType = ValidDataType<TypeSpec, "string">,
> =
  // 4. Combine into Arg<...>
  Arg<Name, Optional, Type, ExplicitType, CastData<Type, FallbackSpec>>;

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

export function parseArg<S extends string>(argSpec: S): ParseArg<S> {
  const parts = argSpec.split(/[:=]/);
  const explicitType = argSpec.includes(":");

  const nameOptionalSpec = parts.shift()!;
  const typeSpec = explicitType ? parts.shift() : undefined;
  const fallbackSpec = argSpec.includes("=") ? parts.shift() : undefined;

  const optional = nameOptionalSpec.endsWith("?");
  const name = optional ? nameOptionalSpec.slice(0, -1) : nameOptionalSpec;

  const type: DataType =
    typeSpec && isValidDataType(typeSpec) ? typeSpec : "string";

  const fallback =
    typeof fallbackSpec === "undefined"
      ? null
      : castData({ type, input: fallbackSpec });

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
