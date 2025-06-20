import chalk from "chalk";

import {
  type CastData,
  type DataType,
  type DataTypeByName,
  type ValidDataType,
  castData,
  isValidDataType,
} from "./data-type";
import type { Concat } from "./types/array-type-utils";
import type { And } from "./types/operator-type-utils";
import type { AfterChar, BeforeChar } from "./types/string-type-utils";

/*
 * Types
 */

type ArgType<S extends string> = ValidDataType<
  AfterChar<":", BeforeChar<"=", S>, "string">,
  "string"
>;

export type Arg<S extends string = string> = {
  name: BeforeChar<"?", BeforeChar<":", BeforeChar<"=", S>>>;
  optional: BeforeChar<":", BeforeChar<"=", S>> extends `${string}?`
    ? true
    : false;
  type: ArgType<S>;
  fallback: CastData<ArgType<S>, AfterChar<"=", S, undefined>>;
};

export type ExtractArgs<S extends string> = Concat<
  S extends `-${string}` ? [] : [Arg<BeforeChar<" ", S>>],
  AfterChar<" ", S> extends never ? [] : ExtractArgs<AfterChar<" ", S>>
>;

export type ArgsToRecord<Args extends Arg[]> = {
  [K in Args[number] as K["name"]]: And<
    K["optional"],
    K["fallback"] extends undefined ? true : false
  > extends true
    ? DataTypeByName<K["type"]> | undefined
    : DataTypeByName<K["type"]>;
};

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

export function isArgInput(input: string) {
  return !input.startsWith("-");
}

export function parseArg<S extends string>(input: S): Arg<S> {
  const parts = input.split(/[:=]/);

  const rawName = parts.shift()!;
  const rawType = input.includes(":") ? parts.shift() : undefined;
  const rawFallback = input.includes("=") ? parts.shift() : undefined;

  const optional = rawName.endsWith("?");
  const name = optional ? rawName.slice(0, -1) : rawName;

  const type: DataType =
    rawType && isValidDataType(rawType) ? rawType : "string";

  const fallback = rawFallback
    ? castData({ type, input: rawFallback })
    : undefined;

  return { name, type, optional, fallback } as Arg<S>;
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
