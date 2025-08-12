import type { DataTypeToken } from "./data-type-token";

export type DataType<DT extends DataTypeToken = DataTypeToken> =
  DT extends "string"
    ? string
    : DT extends "boolean"
      ? boolean
      : DT extends "number"
        ? number
        : unknown;
