import chalk from "chalk";

import {
  type CastData,
  type DataType,
  type DataTypeByName,
  type ValidDataType,
  castData,
  isValidDataType,
} from "./data-type";
import type { Concat, EmptyArray } from "./types/array-type-utils";
import type { Or } from "./types/operator-type-utils";
import type { AfterChar, BeforeChar } from "./types/string-type-utils";

/*
 * Types
 */

type WithoutFlagMarkers<S extends string> = S extends `--${infer Name}`
  ? Name
  : S extends `-${infer Name}`
    ? Name
    : S;

type FlagShort<S extends string> = S extends `--${string}`
  ? S extends `--${string}(-${infer Short}${string})${string}`
    ? Short
    : null
  : true;

type FlagType<S extends string> = ValidDataType<
  AfterChar<":", BeforeChar<"=", S>, "boolean">,
  "boolean"
>;

type FlagOnlyFirstLetterIfShort<S extends string> = S extends `--${string}`
  ? S
  : `-${S[1]}`;

export type Flag<S extends string = any> = {
  name: WithoutFlagMarkers<
    FlagOnlyFirstLetterIfShort<
      BeforeChar<"(", BeforeChar<"!", BeforeChar<":", BeforeChar<"=", S>>>>
    >
  >;
  short: FlagShort<S>;
  type: FlagType<S>;
  explicitType: S extends `${string}:${string}` ? true : false;
  required: BeforeChar<":", BeforeChar<"=", S>> extends `${string}!`
    ? true
    : false;
  fallback: CastData<FlagType<S>, AfterChar<"=", S, null>>;
};

export type ExtractFlags<S extends string> = Concat<
  S extends `-${string}` ? [Flag<BeforeChar<" ", S>>] : EmptyArray<Flag>,
  AfterChar<" ", S> extends never
    ? EmptyArray<Flag>
    : ExtractFlags<AfterChar<" ", S>>
>;

export type FlagsToRecord<Flags extends Flag[]> = {
  [K in Flags[number] as K["name"]]: Or<
    K["required"],
    K["fallback"] extends null ? false : true
  > extends true
    ? DataTypeByName<K["type"]>
    : DataTypeByName<K["type"]> | null;
};

/*
 * Functions
 */

export function isFlagInput(input: string) {
  return input.startsWith("-");
}

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

export function parseFlag<S extends string>(input: S): Flag<S> {
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

  const fallback = rawFallback ? castData({ type, input: rawFallback }) : null;

  return { name, short, type, explicitType, required, fallback } as Flag<S>;
}

export function castFlag<F extends Flag>({
  flag,
  input,
}: {
  flag: F;
  input: string;
}): DataTypeByName<F["type"]> {
  if (flag.required && !input) {
    throw new Error(
      `Flag ${chalk.bold(`${flag.name}:${flag.type}`)} is required and was not provided.`,
    );
  }

  try {
    return castData({ type: flag.type, input }) as DataTypeByName<F["type"]>;
  } catch {
    throw new Error(
      `Invalid value ${chalk.redBright(input)} for flag ${chalk.bold(`${flag.name}:${flag.type}`)}`,
    );
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
