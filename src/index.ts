// Export utils
export { type ExpandObject } from "./types/object-type-utils";

// Export data type
export {
  type DataType,
  type ValidDataType,
  type TruthyValue,
  truthyValues,
  type FalsyValue,
  falsyValues,
  castData,
  type CastData,
  dataTypes,
  isValidDataType,
  type DataTypeByName,
} from "./data-type";

// Export arg, flag and blueprint
export { type Arg, type ParseArg, parseArg, castArg, formatArg } from "./arg";

export {
  type Flag,
  type ParseFlag,
  parseFlag,
  castFlag,
  formatFlag,
} from "./flag";

export {
  type Blueprint,
  type RecordFromBlueprint,
  type ParseBlueprint,
  blueprint,
  isArgPart,
  isFlagPart,
} from "./blueprint";

// Export command
export { command } from "./command";

// Export kit
export { prompt } from "./kit/prompt";
