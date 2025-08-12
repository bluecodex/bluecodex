import { type DataTypeToken, dataTypeTokens } from "./data-type-token";

export type IsValidDataTypeToken<
  RawDataType extends string,
  ErrorClass extends Error,
> = RawDataType extends DataTypeToken ? RawDataType : ErrorClass;

export function isValidDataType(
  dataTypeToken: string,
): dataTypeToken is DataTypeToken {
  return dataTypeTokens.includes(dataTypeToken);
}
