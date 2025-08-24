import type { ValidArg } from "../arg/arg";
import type { DataType } from "../data-type/data-type";
import type { DataTypeSchema } from "../data-type/data-type-schema";
import type { ValidFlag } from "../flag/flag";
import { ParseArgvCustomValidationError } from "./errors/parse-argv-custom-validation-error";
import { ParseArgvInvalidChoiceError } from "./errors/parse-argv-invalid-choice-error";

type Args = {
  field: ValidArg | ValidFlag;
  schema: DataTypeSchema;
  value: DataType;
};

export function assertValueValidForFieldAndSchema({
  field,
  schema,
  value,
}: Args) {
  if (schema.validate) {
    if (typeof schema.validate === "function") {
      const result = schema.validate(value);

      if (result !== true) {
        throw new ParseArgvCustomValidationError(
          field,
          value,
          typeof result === "string" ? result : null,
        );
      }
    } else {
      const choices = schema.validate.map((choice) =>
        typeof choice === "object" ? choice.value : choice,
      );

      if (value === null || !choices.includes(value))
        throw new ParseArgvInvalidChoiceError(field, choices, value);
    }
  }
}
