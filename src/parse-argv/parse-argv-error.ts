import { ParseArgvCustomValidationError } from "./errors/parse-argv-custom-validation-error";
import { ParseArgvInvalidChoiceError } from "./errors/parse-argv-invalid-choice-error";
import { ParseArgvMalformattedInputError } from "./errors/parse-argv-malformatted-input-error";
import { ParseArgvMissingRequiredFieldError } from "./errors/parse-argv-missing-required-field-error";
import { ParseArgvNumberCannotFloatError } from "./errors/parse-argv-number-cannot-float-error";
import { ParseArgvNumberOutOfRangeError } from "./errors/parse-argv-number-out-of-range-error";

export type ParseArgvError =
  | ParseArgvCustomValidationError
  | ParseArgvInvalidChoiceError
  | ParseArgvMissingRequiredFieldError
  | ParseArgvNumberCannotFloatError
  | ParseArgvNumberOutOfRangeError;

export function assertIsParseCliArgvError(
  error: unknown,
): asserts error is ParseArgvError {
  if (
    error instanceof ParseArgvCustomValidationError ||
    error instanceof ParseArgvInvalidChoiceError ||
    error instanceof ParseArgvMalformattedInputError ||
    error instanceof ParseArgvMissingRequiredFieldError ||
    error instanceof ParseArgvNumberCannotFloatError ||
    error instanceof ParseArgvNumberOutOfRangeError
  )
    return;

  throw error;
}
