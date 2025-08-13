import type { ValidArg } from "../arg/arg";
import type { DataType } from "../data-type/data-type";
import type { DataTypeSchema } from "../data-type/data-type-schema";
import type { ValidFlag } from "../flag/flag";
import { ParseArgvCustomValidationError } from "./errors/parse-argv-custom-validation-error";
import { ParseArgvInvalidChoiceError } from "./errors/parse-argv-invalid-choice-error";
import { ParseArgvNumberCannotFloatError } from "./errors/parse-argv-number-cannot-float-error";
import { ParseArgvNumberOutOfRangeError } from "./errors/parse-argv-number-out-of-range-error";

type Args<F extends ValidArg | ValidFlag> = {
  field: F;
  schema: DataTypeSchema<F["type"]>;
  value: DataType<F["type"]>;
};

export function assertValueValidForFieldAndSchema<
  F extends ValidArg | ValidFlag,
>({ field, schema: uncastSchema, value: uncastValue }: Args<F>) {
  switch (field.type) {
    case "string": {
      const schema = uncastSchema as DataTypeSchema<typeof field.type>;
      const value = uncastValue as DataType<typeof field.type>;

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
            typeof choice === "string" ? choice : choice.value,
          );

          if (!choices.includes(value))
            throw new ParseArgvInvalidChoiceError(field, choices, value);
        }
      }

      break;
    }

    case "number": {
      const schema = uncastSchema as DataTypeSchema<typeof field.type>;
      const value = uncastValue as DataType<typeof field.type>;

      if (
        (typeof schema.min !== "undefined" && value < schema.min) ||
        (typeof schema.max !== "undefined" && value > schema.max)
      ) {
        const range = { min: schema.min ?? null, max: schema.max ?? null };
        throw new ParseArgvNumberOutOfRangeError(field, range, value);
      }

      if (!schema.float && Math.abs(value) !== value) {
        throw new ParseArgvNumberCannotFloatError(field, value);
      }

      if (schema.validate) {
        const result = schema.validate(value);

        if (result !== true) {
          throw new ParseArgvCustomValidationError(
            field,
            value,
            typeof result === "string" ? result : null,
          );
        }
      }

      break;
    }

    case "boolean":
      break;
  }
}
