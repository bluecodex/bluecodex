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
  // 1. raw fallback
  S extends `${infer Part2}=${infer RawFallback}`
    ? ParseArg_Step2<RawFallback, Part2>
    : ParseArg_Step2<null, S>;

type ParseArg_Step2<RawFallback extends string | null, S extends string> =
  // 2. raw type
  S extends `${infer Part3}:${infer RawType}`
    ? ParseArg_Step3<RawFallback, RawType, Part3>
    : ParseArg_Step3<RawFallback, null, S>;

type ParseArg_Step3<
  RawFallback extends string | null,
  RawType extends string | null,
  S extends string,
> =
  // 3. optional, name
  S extends `${infer Name}?`
    ? ParseArg_Step4<RawFallback, RawType, true, Name>
    : ParseArg_Step4<RawFallback, RawType, false, S>;

type ParseArg_Step4<
  RawFallback extends string | null,
  RawType extends string | null,
  Optional extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = RawType extends null ? false : true,
  Type extends DataType = ValidDataType<RawType, "string">,
> =
  // 4. Combine into Arg<...>
  Arg<Name, Optional, Type, ExplicitType, CastData<Type, RawFallback>>;

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

export function parseArg<S extends string>(input: S): ParseArg<S> {
  const parts = input.split(/[:=]/);
  const explicitType = input.includes(":");

  const rawName = parts.shift()!;
  const rawType = explicitType ? parts.shift() : undefined;
  const rawFallback = input.includes("=") ? parts.shift() : undefined;

  const optional = rawName.endsWith("?");
  const name = optional ? rawName.slice(0, -1) : rawName;

  const type: DataType =
    rawType && isValidDataType(rawType) ? rawType : "string";

  const fallback =
    typeof rawFallback === "undefined"
      ? null
      : castData({ type, input: rawFallback });

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
