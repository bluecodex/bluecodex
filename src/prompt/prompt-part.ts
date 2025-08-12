import type { DataTypeSchema } from "../data-type/data-type-schema";
import type { DataTypeToken } from "../data-type/data-type-token";
import { prompt } from "../prompt/prompt";

type Args = {
  type: DataTypeToken;
  name: string;
  schema: DataTypeSchema;
};

export async function promptPart({ type, name, schema: uncastSchema }: Args) {
  switch (type) {
    case "string": {
      const argSchema = uncastSchema as DataTypeSchema<typeof type>;

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
      const argSchema = uncastSchema as DataTypeSchema<typeof type>;

      return prompt.confirm(
        argSchema.message ?? `Provide confirmation for ${name}`,
        { initial: argSchema.initial },
      );
    }

    case "number": {
      const argSchema = uncastSchema as DataTypeSchema<typeof type>;

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
