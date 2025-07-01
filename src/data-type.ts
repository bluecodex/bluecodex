/*
 * Constants
 */
import type { StringToNumber } from "./types/string-type-utils";

export const dataTypes = ["string", "boolean", "number"] as const;
export type DataTypeToken = (typeof dataTypes)[number];

export const truthyValues = ["true", "t", "yes", "y", "1"] as const;
export type TruthyValue = (typeof truthyValues)[number];

export const falsyValues = ["false", "f", "no", "n", "0"] as const;
export type FalsyValue = (typeof falsyValues)[number];

/*
 * Errors
 */

export class CastBooleanError<Token extends string = string> extends Error {
  constructor(readonly token: Token) {
    super();
  }

  get message() {
    return `Unable to cast "${this.token}" to boolean`;
  }
}

export class CastNumberError<Token extends string = string> extends Error {
  constructor(readonly token: Token) {
    super();
  }

  get message() {
    return `Unable to cast "${this.token}" to number`;
  }
}

/*
 * Types
 */

export type DataTypeCastError = CastBooleanError | CastNumberError;

export type DataTypeByToken<DT extends DataTypeToken> = DT extends "string"
  ? string
  : DT extends "boolean"
    ? boolean
    : DT extends "number"
      ? number
      : unknown;

export type ValidDataTypeToken<
  RawDataType extends string,
  ErrorClass extends Error,
> = RawDataType extends DataTypeToken ? RawDataType : ErrorClass;

export type CastData<
  DT extends DataTypeToken,
  ValueToken extends string | null,
> = ValueToken extends string
  ? DT extends "string"
    ? ValueToken
    : DT extends "number"
      ? StringToNumber<ValueToken, CastNumberError<ValueToken>>
      : DT extends "boolean"
        ? ValueToken extends TruthyValue
          ? true
          : ValueToken extends FalsyValue
            ? false
            : CastBooleanError<ValueToken>
        : never
  : null;

/*
 * Functions
 */

export function isValidDataType(
  dataTypeToken: string,
): dataTypeToken is DataTypeToken {
  return dataTypes.includes(dataTypeToken);
}

export function castData<DT extends DataTypeToken>({
  type,
  input,
}: {
  type: DT;
  input: string;
}): DataTypeByToken<DT> | null {
  switch (type) {
    case "string":
      return input as DataTypeByToken<DT>;
    case "number": {
      const numberCast = Number(input);
      if (isNaN(numberCast)) return null;

      return numberCast as DataTypeByToken<DT>;
    }
    case "boolean":
      if (truthyValues.includes(input)) return true as DataTypeByToken<DT>;
      if (falsyValues.includes(input)) return false as DataTypeByToken<DT>;

      return null;
  }
}
