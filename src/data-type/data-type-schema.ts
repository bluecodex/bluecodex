import type { DataType } from "./data-type";

export type DataTypeSchemaValidateArray<DT extends DataType = DataType> = Array<
  DT | { value: DT; title?: string; description?: string }
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
  prompt?: string;
  // TODO: [feature] prompt `async fn?:` to allow custom prompt implementation
  // TODO: [feature] transform?:
};
