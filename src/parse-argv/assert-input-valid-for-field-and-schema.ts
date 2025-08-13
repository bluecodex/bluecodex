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
  input: DataType<F["type"]>;
};

export function assertInputValidForFieldAndSchema<
  F extends ValidArg | ValidFlag,
>({ field, schema: uncastSchema, input: uncastInput }: Args<F>) {
  switch (field.type) {
    case "string": {
      const schema = uncastSchema as DataTypeSchema<typeof field.type>;
      const input = uncastInput as DataType<typeof field.type>;

      if (
        "choices" in schema &&
        schema.choices &&
        !schema.choices.includes(input)
      ) {
        throw new ParseArgvInvalidChoiceError(field, schema.choices, input);
      }

      if ("validate" in schema && schema.validate) {
        const result = schema.validate(input);

        if (result !== true) {
          throw new ParseArgvCustomValidationError(
            field,
            input,
            typeof result === "string" ? result : null,
          );
        }
      }

      break;
    }

    case "number": {
      const schema = uncastSchema as DataTypeSchema<typeof field.type>;
      const input = uncastInput as DataType<typeof field.type>;

      if (
        (typeof schema.min !== "undefined" && input < schema.min) ||
        (typeof schema.max !== "undefined" && input > schema.max)
      ) {
        const range = { min: schema.min ?? null, max: schema.max ?? null };
        throw new ParseArgvNumberOutOfRangeError(field, range, input);
      }

      if (!schema.float && Math.abs(input) !== input) {
        throw new ParseArgvNumberCannotFloatError(field, input);
      }

      if (schema.validate) {
        const result = schema.validate(input);

        if (result !== true) {
          throw new ParseArgvCustomValidationError(
            field,
            input,
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
