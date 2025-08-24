import type { ValidArg } from "../arg/arg";
import type {
  DataTypeSchema,
  DataTypeSchemaValidateFn,
} from "../data-type/data-type-schema";
import type { ValidFlag } from "../flag/flag";
import { prompt } from "./prompt";

type Args = {
  field: ValidArg | ValidFlag;
  schema: DataTypeSchema;
};

export async function promptField({ field, schema }: Args) {
  if (Array.isArray(schema.validate)) {
    return prompt.select<any>(
      schema.prompt ?? `Select a value for ${field.name}`,
      schema.validate,
      { initial: schema.initial },
    );
  }

  switch (field.type) {
    case "string":
      return prompt(schema.prompt ?? `Enter value for ${field.name}`, {
        initial: schema.initial as string | undefined,
        validate: schema.validate as DataTypeSchemaValidateFn | undefined,
      });

    case "boolean":
      return prompt.confirm(
        schema.prompt ?? `Provide confirmation for ${field.name}`,
        {
          initial: schema.initial as boolean | undefined,
        },
      );

    case "number":
      return prompt.number(
        schema.prompt ?? `Enter a number for ${field.name}`,
        {
          initial: schema.initial as number | undefined,
          validate: schema.validate as DataTypeSchemaValidateFn | undefined,
        },
      );
  }
}
