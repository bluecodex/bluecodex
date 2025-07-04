export const dataTypeTokens = ["string", "boolean", "number"] as const;
export type DataTypeToken = (typeof dataTypeTokens)[number];

export const truthyValues = ["true", "t", "yes", "y", "1"] as const;
export type TruthyValue = (typeof truthyValues)[number];

export const falsyValues = ["false", "f", "no", "n", "0"] as const;
export type FalsyValue = (typeof falsyValues)[number];

export type DataTypeByToken<DT extends DataTypeToken> = DT extends "string"
  ? string
  : DT extends "boolean"
    ? boolean
    : DT extends "number"
      ? number
      : unknown;
