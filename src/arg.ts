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
 * Functions
 */

export function isArgStr(str: string) {
  return !str.startsWith("-");
}

export function parseArg<S extends string>(str: S): Arg<S> {
  const parts = str.split(/[:=]/);

  const rawName = parts.shift()!;
  const rawType = str.includes(":") ? parts.shift() : undefined;
  const rawFallback = str.includes("=") ? parts.shift() : undefined;

  const optional = rawName.endsWith("?");
  const name = optional ? rawName.slice(0, -1) : rawName;

  const type: DataType =
    rawType && isValidDataType(rawType) ? rawType : "string";

  const fallback = rawFallback
    ? castData({ type, str: rawFallback })
    : undefined;

  return { name, type, optional, fallback } as Arg<S>;
}
