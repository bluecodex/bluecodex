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
  // 1. fallback spec
  S extends `${infer Part2}=${infer FallbackSpec}`
    ? ParseLongFlag_Step2<FallbackSpec, Part2>
    : ParseLongFlag_Step2<null, S>;

type ParseLongFlag_Step2<FallbackSpec extends string | null, S extends string> =
  // 3. type spec, explicit type
  S extends `${infer Step3}:${infer TypeSpec}`
    ? ParseLongFlag_Step3<FallbackSpec, TypeSpec, Step3>
    : ParseLongFlag_Step3<FallbackSpec, null, S>;

type ParseLongFlag_Step3<
  FallbackSpec extends string | null,
  TypeSpec extends string | null,
  S extends string,
> =
  // 3. required
  S extends `${infer Part4}!`
    ? ParseLongFlag_Step4<FallbackSpec, TypeSpec, true, Part4>
    : ParseLongFlag_Step4<FallbackSpec, TypeSpec, false, S>;

type ParseLongFlag_Step4<
  FallbackSpec extends string | null,
  TypeSpec extends string | null,
  Required extends boolean,
  S extends string,
> =
  // 4. short, name
  S extends `${infer Name}(${infer ShortSpec}`
    ? ShortSpec extends `-${infer Short}${string})`
      ? ParseLongFlag_Step5<FallbackSpec, TypeSpec, Required, Short, Name>
      : ParseLongFlag_Step5<FallbackSpec, TypeSpec, Required, null, Name>
    : ParseLongFlag_Step5<FallbackSpec, TypeSpec, Required, null, S>;

type ParseLongFlag_Step5<
  FallbackSpec extends string | null,
  TypeSpec extends string | null,
  Required extends boolean,
  Short extends string | null,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeSpec extends null ? false : true,
  Type extends DataType = ValidDataType<TypeSpec, "boolean">,
> =
  // 5. Combine into Flag<...>
  Flag<Name, Short, Required, Type, ExplicitType, CastData<Type, FallbackSpec>>;

/*
 * Internal parse short types
 */

type ParseShortFlag_Step1<S extends string> =
  // 1. fallback spec
  S extends `${infer Part2}=${infer FallbackSpec}`
    ? ParseShortFlag_Step2<FallbackSpec, Part2>
    : ParseShortFlag_Step2<null, S>;

type ParseShortFlag_Step2<
  FallbackSpec extends string | null,
  S extends string,
> =
  // 2. type spec
  S extends `${infer Part4}:${infer TypeSpec}`
    ? ParseShortFlag_Step3<FallbackSpec, TypeSpec, Part4>
    : ParseShortFlag_Step3<FallbackSpec, null, S>;

type ParseShortFlag_Step3<
  // 3. required, name
  FallbackSpec extends string | null,
  TypeSpec extends string | null,
  S extends string,
> = S extends `${infer Name}${string}!`
  ? ParseShortFlag_Step4<FallbackSpec, TypeSpec, true, Name>
  : ParseShortFlag_Step4<FallbackSpec, TypeSpec, false, S>;

type ParseShortFlag_Step4<
  FallbackSpec extends string | null,
  TypeSpec extends string | null,
  Required extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = TypeSpec extends null ? false : true,
  Type extends DataType = ValidDataType<TypeSpec, "boolean">,
> =
  // 4. Combine into Flag<...>
  Flag<Name, true, Required, Type, ExplicitType, CastData<Type, FallbackSpec>>;

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

export function extractFlagShortFromNameInput(nameShortSpec: string) {
  const index = nameShortSpec.indexOf("(");
  if (index === -1) return { name: nameShortSpec, short: null };

  const name = nameShortSpec.slice(0, index);
  const shortSpec = nameShortSpec.slice(index);
  const short = shortSpec[2];

  const isValidShortLetter = /^[a-zA-Z]$/.test(short);
  const isValidShort =
    shortSpec.startsWith("(-") && shortSpec.endsWith(")") && isValidShortLetter;

  return { name, short: isValidShort ? short : null };
}

export function parseFlag<S extends string>(flagSpec: S): ParseFlag<S> {
  const dashCount = flagSpec[1] === "-" ? 2 : 1;

  const parts = flagSpec.slice(dashCount).split(/[:=]/);
  const explicitType = flagSpec.includes(":");

  const nameRequiredSpec = parts.shift()!;
  const typeSpec = explicitType ? parts.shift() : undefined;
  const fallbackSpec = flagSpec.includes("=") ? parts.shift() : undefined;

  const required = nameRequiredSpec.endsWith("!");
  const nameSpec = required ? nameRequiredSpec.slice(0, -1) : nameRequiredSpec;

  const { name, short } =
    dashCount === 1
      ? { name: nameSpec[0], short: true }
      : extractFlagShortFromNameInput(nameSpec);

  const type: DataType =
    typeSpec && isValidDataType(typeSpec) ? typeSpec : "boolean";

  const fallback =
    typeof fallbackSpec === "undefined"
      ? null
      : castData({ type, input: fallbackSpec });

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
