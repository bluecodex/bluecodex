import type { DataTypeToken } from "./data-type-token";

export type DataType<DTToken extends DataTypeToken = DataTypeToken> =
  DTToken extends "string"
    ? string
    : DTToken extends "boolean"
      ? boolean
      : DTToken extends "number"
        ? number
        : unknown;
