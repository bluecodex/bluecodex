import type { DataTypeCastBooleanError } from "./data-type-cast-boolean-error";
import type { DataTypeCastNumberError } from "./data-type-cast-number-error";

export type DataTypeCastError =
  | DataTypeCastBooleanError
  | DataTypeCastNumberError;
