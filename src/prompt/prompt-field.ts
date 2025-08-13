import type { ValidArg } from "../arg/arg";
import type { DataTypeSchema } from "../data-type/data-type-schema";
import type { ValidFlag } from "../flag/flag";
import { prompt } from "../prompt/prompt";

type Args = {
  field: ValidArg | ValidFlag;
  schema: DataTypeSchema;
};

export async function promptField({ field, schema: uncastSchema }: Args) {
  const name = field.name;
  
  switch (field.type) {
    case "string": {
      const argSchema = uncastSchema as DataTypeSchema<typeof field.type>;

      if ("choices" in argSchema && argSchema.choices) {
        return prompt.select(
          argSchema.message ?? `Select a value for ${name}`,
          argSchema.choices,
          { initial: argSchema.initial },
        );
      }

      return prompt(argSchema.message ?? `Enter value for ${name}`, {
        initial: argSchema.initial,
        validate: "validate" in argSchema ? argSchema.validate : undefined,
      });
    }

    case "boolean": {
      const argSchema = uncastSchema as DataTypeSchema<typeof field.type>;

      return prompt.confirm(
        argSchema.message ?? `Provide confirmation for ${name}`,
        { initial: argSchema.initial },
      );
    }

    case "number": {
      const argSchema = uncastSchema as DataTypeSchema<typeof field.type>;

      return prompt.number(argSchema.message ?? `Enter a number for ${name}`, {
        initial: argSchema.initial,
        min: argSchema.min,
        max: argSchema.max,
        float: argSchema.float,
        step: argSchema.step,
      });
    }
  }
}
