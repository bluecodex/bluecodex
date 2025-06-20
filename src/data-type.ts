/*
 * Constants
 */
import type { StringToNumber } from "./types/string-type-utils";

export const dataTypes = ["string", "boolean", "number"] as const;
export type DataType = (typeof dataTypes)[number];

export const truthyValues = ["true", "1", "y", "yes"] as const;
export type TruthyValue = (typeof truthyValues)[number];

export const falsyValues = ["false", "0", "n", "no"] as const;
export type FalsyValue = (typeof falsyValues)[number];

/*
 * Types
 */

export type DataTypeByName<DT extends DataType> = DT extends "string"
  ? string
  : DT extends "boolean"
    ? boolean
    : DT extends "number"
      ? number
      : unknown;

export type ValidDataType<
  DT extends string,
  Fallback extends DataType,
> = DT extends DataType ? DT : Fallback;

export type CastData<
  DT extends DataType,
  S extends string | null,
> = S extends string
  ? DT extends "string"
    ? S
    : DT extends "number"
      ? StringToNumber<S>
      : DT extends "boolean"
        ? S extends TruthyValue
          ? true
          : false
        : null
  : null;

/*
 * Functions
 */

export function isValidDataType(input: string): input is DataType {
  return dataTypes.includes(input);
}

export function castData<DT extends DataType>({
  type,
  input,
}: {
  type: DT;
  input: string;
}): DataTypeByName<DT> {
  switch (type) {
    case "string":
      return input as DataTypeByName<DT>;
    case "number":
      return Number(input) as DataTypeByName<DT>;
    case "boolean":
      if (truthyValues.includes(input)) return true as DataTypeByName<DT>;
      if (falsyValues.includes(input)) return false as DataTypeByName<DT>;

      throw new Error(`Invalid boolean value "${input}"`);
  }
}
