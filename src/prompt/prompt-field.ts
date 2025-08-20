import type { ValidArg } from "../arg/arg";
import type { DataTypeSchema } from "../data-type/data-type-schema";
import type { ValidFlag } from "../flag/flag";
import { prompt } from "./prompt";

type Args = {
  field: ValidArg | ValidFlag;
  schema: DataTypeSchema;
};

export async function promptField({ field, schema: uncastSchema }: Args) {
  const name = field.name;

  switch (field.type) {
    case "string": {
      const schema = uncastSchema as DataTypeSchema<typeof field.type>;

      if (Array.isArray(schema.validate)) {
        return prompt.select(
          schema.message ?? `Select a value for ${name}`,
          schema.validate,
          { initial: schema.initial },
        );
      }

      return prompt(schema.message ?? `Enter value for ${name}`, {
        initial: schema.initial,
        validate:
          "validate" in schema && typeof schema.validate === "function"
            ? schema.validate
            : undefined,
      });
    }

    case "boolean": {
      const schema = uncastSchema as DataTypeSchema<typeof field.type>;

      return prompt.confirm(
        schema.message ?? `Provide confirmation for ${name}`,
        { initial: schema.initial },
      );
    }

    case "number": {
      const schema = uncastSchema as DataTypeSchema<typeof field.type>;

      return prompt.number(schema.message ?? `Enter a number for ${name}`, {
        initial: schema.initial,
        min: schema.min,
        max: schema.max,
        float: schema.float,
        step: schema.step,
      });
    }
  }
}
