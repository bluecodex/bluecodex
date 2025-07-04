import type { CastBooleanError } from "./cast-boolean-error";
import type { CastNumberError } from "./cast-number-error";

export type DataTypeCastError = CastBooleanError | CastNumberError;
