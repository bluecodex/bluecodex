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

type ArgFromMaybes<
  MaybeOptionalName extends string,
  MaybeValidType extends string,
  ExplicitType extends boolean,
  MaybeFallback extends string | null,
  // --
  Type extends DataType = ValidDataType<MaybeValidType, "string">,
  Fallback extends any | null = CastData<Type, MaybeFallback>,
> = MaybeOptionalName extends `${infer OptionalName}?`
  ? Arg<OptionalName, true, Type, ExplicitType, Fallback>
  : Arg<
      MaybeOptionalName,
      false,
      ValidDataType<MaybeValidType, "string">,
      ExplicitType,
      Fallback
    >;

export type ArgFromInput<S extends string> =
  S extends `${infer MaybeOptionalName}:${infer MaybeValidType}=${infer Fallback}`
    ? ArgFromMaybes<MaybeOptionalName, MaybeValidType, true, Fallback>
    : S extends `${infer MaybeOptionalName}:${infer MaybeValidType}`
      ? ArgFromMaybes<MaybeOptionalName, MaybeValidType, true, null>
      : S extends `${infer MaybeOptionalName}=${infer Fallback}`
        ? ArgFromMaybes<MaybeOptionalName, "string", false, Fallback>
        : ArgFromMaybes<S, "string", false, null>;

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

export function parseArg<S extends string>(input: S): ArgFromInput<S> {
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
  } satisfies Arg<any, any, any, any> as ArgFromInput<S>;
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
