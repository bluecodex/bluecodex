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

export type Flag<S extends string = string> = {
  name: WithoutFlagMarkers<
    BeforeChar<"!", BeforeChar<":", BeforeChar<"=", S>>>
  >;
  required: BeforeChar<":", BeforeChar<"=", S>> extends `${string}!`
    ? true
    : false;
  type: FlagType<S>;
  fallback: CastData<FlagType<S>, AfterChar<"=", S, undefined>>;
};

export type ExtractFlags<S extends string> = Concat<
  S extends `-${string}` ? [Flag<BeforeChar<" ", S>>] : [],
  AfterChar<" ", S> extends never ? [] : ExtractFlags<AfterChar<" ", S>>
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

export function isFlagStr(str: string) {
  return str.startsWith("-");
}

export function parseFlag<S extends string>(str: S): Flag<S> {
  const dashCount = str[0] === "-" ? (str[1] === "-" ? 2 : 1) : 0;
  const parts = str.slice(dashCount).split(/[:=]/);

  const rawName = parts.shift()!;
  const rawType = str.includes(":") ? parts.shift() : undefined;
  const rawFallback = str.includes("=") ? parts.shift() : undefined;

  const required = rawName.endsWith("!");
  const name = required ? rawName.slice(0, -1) : rawName;

  const type: DataType =
    rawType && isValidDataType(rawType) ? rawType : "boolean";

  const fallback = rawFallback
    ? castData({ type, str: rawFallback })
    : undefined;

  return { name, type, required, fallback } as Flag<S>;
}
