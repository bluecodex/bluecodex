import type { StringToNumber } from "../types/string-type-utils";
import type { DataTypeByToken } from "./data-type-constants";
import {
  type DataTypeToken,
  type FalsyValue,
  type TruthyValue,
  falsyValues,
  truthyValues,
} from "./data-type-constants";
import type { CastBooleanError } from "./errors/cast-boolean-error";
import type { CastNumberError } from "./errors/cast-number-error";

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
