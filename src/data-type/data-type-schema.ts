import type { DataType } from "./data-type";

export type DataTypeSchemaValidateArray<DT extends DataType = DataType> = Array<
  DT | { value: DT; description?: string }
>;

export type DataTypeSchemaValidateFn<DT extends DataType = DataType> = (
  value: DT,
) => boolean | string;

export type DataTypeSchema<DT extends DataType = DataType> = {
  initial?: DT;
  validate?:
    | DataTypeSchemaValidateArray<DT>
    | Readonly<DataTypeSchemaValidateArray<DT>>
    | DataTypeSchemaValidateFn<DT>;
  message?: string;
};
