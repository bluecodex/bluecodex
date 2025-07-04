import type { CastBooleanError } from "./cast-boolean-error";
import type { DataTypeCastNumberError } from "./data-type-cast-number-error";

export type DataTypeCastError = CastBooleanError | DataTypeCastNumberError;
