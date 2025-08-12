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
  DT extends DataTypeToken,
  ValueToken extends string | null,
> = ValueToken extends string
  ? DT extends "string"
    ? ValueToken
    : DT extends "number"
      ? StringToNumber<ValueToken, DataTypeCastNumberError<ValueToken>>
      : DT extends "boolean"
        ? ValueToken extends TruthyValue
          ? true
          : ValueToken extends FalsyValue
            ? false
            : DataTypeCastBooleanError<ValueToken>
        : never
  : null;

export function castData<DT extends DataTypeToken>({
  type,
  input,
}: {
  type: DT;
  input: string;
}): DataType<DT> {
  switch (type) {
    case "string":
      return input as DataType<DT>;
    case "number": {
      const numberCast = Number(input);
      if (isNaN(numberCast)) throw new DataTypeCastNumberError(input);

      return numberCast as DataType<DT>;
    }
    case "boolean":
      if (truthyValues.includes(input)) return true as DataType<DT>;
      if (falsyValues.includes(input)) return false as DataType<DT>;

      throw new DataTypeCastBooleanError(input);
  }
}
