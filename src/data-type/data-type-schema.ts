import type { DataType } from "./data-type";

export type DataTypeSchemaValidateArray<DT extends DataType = DataType> = Array<
  DT | { value: DT; label?: string; description?: string }
>;

export type DataTypeSchemaValidateFn<DT extends DataType = DataType> = (
  value: DT,
) => boolean;

export type DataTypeSchema<DT extends DataType = DataType> = {
  initial?: DT;
  validate?:
    | DataTypeSchemaValidateArray<DT>
    | Readonly<DataTypeSchemaValidateArray<DT>>
    | DataTypeSchemaValidateFn<DT>;
  // TODO: [feature] validate: | type-guard
  // TODO: [feature] transform?:
  prompt?: string;
  // TODO: [feature] prompt async fn?:
};
