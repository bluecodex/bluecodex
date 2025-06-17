/*
 * Constants
 */
import type { StringToNumber } from "./types/string-type-utils";

export const dataTypes = ["string", "boolean", "number"] as const;
export type DataType = (typeof dataTypes)[number];

export const truthyValues = ["true", "1", "y", "yes"] as const;
export type TruthyValue = (typeof truthyValues)[number];

/*
 * Types
 */

export type DataTypeByName<S extends DataType> = S extends "string"
  ? string
  : S extends "boolean"
    ? boolean
    : S extends "number"
      ? number
      : unknown;

export type ValidDataType<
  S extends string,
  Fallback extends DataType,
> = S extends DataType ? S : Fallback;

export type CastData<
  T extends DataType,
  S extends string | undefined,
> = S extends string
  ? T extends "string"
    ? S
    : T extends "number"
      ? StringToNumber<S>
      : T extends "boolean"
        ? S extends TruthyValue
          ? true
          : false
        : undefined
  : undefined;

/*
 * Functions
 */

export function isValidDataType(str: string): str is DataType {
  return dataTypes.includes(str);
}

export function castData<T extends DataType>({
  type,
  str,
}: {
  type: T;
  str: string;
}) {
  switch (type) {
    case "string":
      return str;
    case "number":
      return Number(str);
    case "boolean":
      return truthyValues.includes(str);
  }
}
