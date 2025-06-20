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

type FlagType<S extends string> = ValidDataType<
  AfterChar<":", BeforeChar<"=", S>, "boolean">,
  "boolean"
>;

export type Flag<S extends string = any> = {
  dash: S extends `--${string}` ? "--" : S extends `-${string}` ? "-" : "";
  name: WithoutFlagMarkers<
    BeforeChar<"!", BeforeChar<":", BeforeChar<"=", S>>>
  >;
  required: BeforeChar<":", BeforeChar<"=", S>> extends `${string}!`
    ? true
    : false;
  type: FlagType<S>;
  explicitType: S extends `${string}:${string}` ? true : false;
  fallback: CastData<FlagType<S>, AfterChar<"=", S, undefined>>;
};

export type ExtractFlags<S extends string> = Concat<
  S extends `-${string}` ? [Flag<BeforeChar<" ", S>>] : Flag[] & [],
  AfterChar<" ", S> extends never
    ? Flag[] & []
    : ExtractFlags<AfterChar<" ", S>>
>;

export type FlagsToRecord<Flags extends Flag[]> = {
  [K in Flags[number] as K["name"]]: Or<
    K["required"],
    K["fallback"] extends undefined ? false : true
  > extends true
    ? DataTypeByName<K["type"]>
    : DataTypeByName<K["type"]> | undefined;
};

/*
 * Functions
 */

export function isFlagInput(input: string) {
  return input.startsWith("-");
}

export function parseFlag<S extends string>(str: S): Flag<S> {
  const dashCount = str[0] === "-" ? (str[1] === "-" ? 2 : 1) : 0;
  const dash = str.slice(0, dashCount);

  const parts = str.slice(dashCount).split(/[:=]/);
  const explicitType = str.includes(":");

  const rawName = parts.shift()!;
  const rawType = explicitType ? parts.shift() : undefined;
  const rawFallback = str.includes("=") ? parts.shift() : undefined;

  const required = rawName.endsWith("!");
  const name = required ? rawName.slice(0, -1) : rawName;

  const type: DataType =
    rawType && isValidDataType(rawType) ? rawType : "boolean";

  const fallback = rawFallback
    ? castData({ type, input: rawFallback })
    : undefined;

  return { dash, name, type, explicitType, required, fallback } as Flag<S>;
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

  parts.push(chalk(`${flag.dash}${flag.name}`));
  if (flag.explicitType) parts.push(chalk.dim(`:${flag.type}`));
  if (flag.fallback) parts.push(chalk.dim(`=${flag.fallback}`));

  return parts.join("");
}
