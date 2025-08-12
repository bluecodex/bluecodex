import type {
  DataTypeSchemaByToken,
  DataTypeToken,
} from "../data-type/data-type-constants";
import { prompt } from "../prompt/prompt";

type Args = {
  type: DataTypeToken;
  name: string;
  partSchema: DataTypeSchemaByToken;
};

export async function promptPart({
  type,
  name,
  partSchema: untypedArgSchema,
}: Args) {
  switch (type) {
    case "string": {
      const argSchema = untypedArgSchema as DataTypeSchemaByToken<typeof type>;

      if ("choices" in argSchema) {
        return prompt.select(
          argSchema.message ?? `Select a value for ${name}`,
          argSchema.choices,
          { initial: argSchema.initial },
        );
      }

      return prompt(argSchema.message ?? `Enter value for ${name}`, {
        initial: argSchema.initial,
        validate: argSchema.validate,
      });
    }

    case "boolean": {
      const argSchema = untypedArgSchema as DataTypeSchemaByToken<typeof type>;

      return prompt.confirm(
        argSchema.message ?? `Provide confirmation for ${name}`,
        { initial: argSchema.initial },
      );
    }

    case "number": {
      const argSchema = untypedArgSchema as DataTypeSchemaByToken<typeof type>;

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
