export const dataTypeTokens = ["string", "boolean", "number"] as const;
export type DataTypeToken = (typeof dataTypeTokens)[number];

export const truthyValues = [
  "true",
  "TRUE",
  "t",
  "T",
  "yes",
  "YES",
  "y",
  "Y",
  "1",
] as const;
export type TruthyValue = (typeof truthyValues)[number];

export const falsyValues = [
  "false",
  "FALSE",
  "f",
  "F",
  "no",
  "NO",
  "n",
  "N",
  "0",
] as const;
export type FalsyValue = (typeof falsyValues)[number];
