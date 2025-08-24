import type { StringToNumber } from "../types/string-type-utils";
import type { DataType } from "./data-type";
import {
  type DataTypeToken,
  type FalsyValue,
  type TruthyValue,
  falsyValues,
  truthyValues,
} from "./data-type-token";
import { DataTypeCastBooleanError } from "./errors/data-type-cast-boolean-error";
import { DataTypeCastNumberError } from "./errors/data-type-cast-number-error";

export type CastData<
  DTToken extends DataTypeToken,
  ValueToken extends string | null,
> = ValueToken extends string
  ? DTToken extends "string"
    ? ValueToken
    : DTToken extends "number"
      ? StringToNumber<ValueToken, DataTypeCastNumberError<ValueToken>>
      : DTToken extends "boolean"
        ? ValueToken extends TruthyValue
          ? true
          : ValueToken extends FalsyValue
            ? false
            : DataTypeCastBooleanError<ValueToken>
        : never
  : null;

export function castData<DTToken extends DataTypeToken>({
  type,
  input,
}: {
  type: DTToken;
  input: string;
}): DataType<DTToken> {
  switch (type) {
    case "string":
      return input as DataType<DTToken>;
    case "number": {
      const numberCast = Number(input);
      if (isNaN(numberCast)) throw new DataTypeCastNumberError(input);

      return numberCast as DataType<DTToken>;
    }
    case "boolean":
      if (truthyValues.includes(input)) return true as DataType<DTToken>;
      if (falsyValues.includes(input)) return false as DataType<DTToken>;

      throw new DataTypeCastBooleanError(input);
  }
}
