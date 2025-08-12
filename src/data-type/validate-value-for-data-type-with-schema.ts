import type { DataType } from "./data-type";
import type { DataTypeSchema } from "./data-type-schema";
import type { DataTypeToken } from "./data-type-token";

type Args = {
  type: DataTypeToken;
  schema: DataTypeSchema;
  value: DataType;
};

export function validateValueForDataTypeWithSchema({
  type,
  schema: uncastSchema,
  value: uncastValue,
}: Args) {
  switch (type) {
    case "string": {
      const schema = uncastSchema as DataTypeSchema<typeof type>;
      const value = uncastValue as DataType<typeof type>;

      if (
        "choices" in schema &&
        schema.choices &&
        !schema.choices.includes(value)
      )
        return false;

      if ("validate" in schema && Boolean(schema.validate?.(value))) {
        return false;
      }

      return true;
    }

    case "number": {
      const schema = uncastSchema as DataTypeSchema<"number">;
      const value = uncastValue as DataType<typeof type>;

      if (typeof schema.min !== "undefined" && value < schema.min) return false;

      if (typeof schema.max !== "undefined" && value > schema.max) return false;

      if (!schema.float && Math.abs(value) !== value) return false;

      if (schema.validate && schema.validate(value) !== true) return false;

      return true;
    }

    case "boolean":
      return true;
  }
}
