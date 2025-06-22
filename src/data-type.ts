/*
 * Constants
 */
import type { StringToNumber } from "./types/string-type-utils";

export const dataTypes = ["string", "boolean", "number"] as const;
export type DataType = (typeof dataTypes)[number];

export const truthyValues = ["true", "t", "yes", "y", "1"] as const;
export type TruthyValue = (typeof truthyValues)[number];

export const falsyValues = ["false", "f", "no", "n", "0"] as const;
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
  DT extends string | null,
  Fallback extends DataType,
> = DT extends DataType ? DT : Fallback;

export type CastData<
  DT extends DataType,
  Token extends string | null,
> = Token extends string
  ? DT extends "string"
    ? Token
    : DT extends "number"
      ? StringToNumber<Token>
      : DT extends "boolean"
        ? Token extends TruthyValue
          ? true
          : false
        : null
  : null;

/*
 * Functions
 */

export function isValidDataType(
  dataTypeToken: string,
): dataTypeToken is DataType {
  return dataTypes.includes(dataTypeToken);
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
      if (input === "") return true as DataTypeByName<DT>;
      if (truthyValues.includes(input)) return true as DataTypeByName<DT>;
      if (falsyValues.includes(input)) return false as DataTypeByName<DT>;

      throw new Error(`Invalid boolean value "${input}"`);
  }
}
