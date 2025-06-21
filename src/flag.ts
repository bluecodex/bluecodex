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
  // 1. raw fallback
  S extends `${infer Part2}=${infer RawFallback}`
    ? ParseLongFlag_Step2<RawFallback, Part2>
    : ParseLongFlag_Step2<null, S>;

type ParseLongFlag_Step2<RawFallback extends string | null, S extends string> =
  // 3. raw type, explicit type
  S extends `${infer Step3}:${infer RawType}`
    ? ParseLongFlag_Step3<RawFallback, RawType, Step3>
    : ParseLongFlag_Step3<RawFallback, null, S>;

type ParseLongFlag_Step3<
  RawFallback extends string | null,
  RawType extends string | null,
  S extends string,
> =
  // 3. required
  S extends `${infer Part4}!`
    ? ParseLongFlag_Step4<RawFallback, RawType, true, Part4>
    : ParseLongFlag_Step4<RawFallback, RawType, false, S>;

type ParseLongFlag_Step4<
  RawFallback extends string | null,
  RawType extends string | null,
  Required extends boolean,
  S extends string,
> =
  // 4. short, name
  S extends `${infer Name}(${infer RawShort}`
    ? RawShort extends `-${infer Short}${string})`
      ? ParseLongFlag_Step5<RawFallback, RawType, Required, Short, Name>
      : ParseLongFlag_Step5<RawFallback, RawType, Required, null, Name>
    : ParseLongFlag_Step5<RawFallback, RawType, Required, null, S>;

type ParseLongFlag_Step5<
  RawFallback extends string | null,
  RawType extends string | null,
  Required extends boolean,
  Short extends string | null,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = RawType extends null ? false : true,
  Type extends DataType = ValidDataType<RawType, "boolean">,
> =
  // 5. Combine into Flag<...>
  Flag<Name, Short, Required, Type, ExplicitType, CastData<Type, RawFallback>>;

/*
 * Internal parse short types
 */

type ParseShortFlag_Step1<S extends string> =
  // 1. raw fallback
  S extends `${infer Part2}=${infer RawFallback}`
    ? ParseShortFlag_Step2<RawFallback, Part2>
    : ParseShortFlag_Step2<null, S>;

type ParseShortFlag_Step2<RawFallback extends string | null, S extends string> =
  // 2. raw type
  S extends `${infer Part4}:${infer RawType}`
    ? ParseShortFlag_Step3<RawFallback, RawType, Part4>
    : ParseShortFlag_Step3<RawFallback, null, S>;

type ParseShortFlag_Step3<
  // 3. required, name
  RawFallback extends string | null,
  RawType extends string | null,
  S extends string,
> = S extends `${infer Name}${string}!`
  ? ParseShortFlag_Step4<RawFallback, RawType, true, Name>
  : ParseShortFlag_Step4<RawFallback, RawType, false, S>;

type ParseShortFlag_Step4<
  RawFallback extends string | null,
  RawType extends string | null,
  Required extends boolean,
  Name extends string,
  // -- computed
  ExplicitType extends boolean = RawType extends null ? false : true,
  Type extends DataType = ValidDataType<RawType, "boolean">,
> =
  // 4. Combine into Flag<...>
  Flag<Name, true, Required, Type, ExplicitType, CastData<Type, RawFallback>>;

/*
 * Exported parse types
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

export function extractFlagShortFromNameInput(nameInput: string) {
  const index = nameInput.indexOf("(");
  if (index === -1) return { name: nameInput, short: null };

  const name = nameInput.slice(0, index);
  const rawShort = nameInput.slice(index);
  const short = rawShort[2];

  const isValidShortLetter = /^[a-zA-Z]$/.test(short);
  const isValidShort =
    rawShort.startsWith("(-") && rawShort.endsWith(")") && isValidShortLetter;

  return { name, short: isValidShort ? short : null };
}

export function parseFlag<S extends string>(input: S): ParseFlag<S> {
  const dashCount = input[1] === "-" ? 2 : 1;

  const parts = input.slice(dashCount).split(/[:=]/);
  const explicitType = input.includes(":");

  const rawName = parts.shift()!;
  const rawType = explicitType ? parts.shift() : undefined;
  const rawFallback = input.includes("=") ? parts.shift() : undefined;

  const required = rawName.endsWith("!");
  const rawNameWithoutHashbang = required ? rawName.slice(0, -1) : rawName;
  const { name, short } =
    dashCount === 1
      ? { name: rawNameWithoutHashbang[0], short: true }
      : extractFlagShortFromNameInput(rawNameWithoutHashbang);

  const type: DataType =
    rawType && isValidDataType(rawType) ? rawType : "boolean";

  const fallback =
    typeof rawFallback === "undefined"
      ? null
      : castData({ type, input: rawFallback });

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
