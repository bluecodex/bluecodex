import type {
  PromptConfirmOptions,
  PromptNumberOptions,
  PromptSelectChoice,
  PromptSelectOptions,
  PromptTextOptions,
  ValueFromPromptSelectChoice,
} from "../prompt/prompt";

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

export type DataTypeByToken<DT extends DataTypeToken> = DT extends "string"
  ? string
  : DT extends "boolean"
    ? boolean
    : DT extends "number"
      ? number
      : unknown;

export type DataTypeByTokenAndSchema<
  DT extends DataTypeToken,
  Schema extends Partial<DataTypeSchemaByToken<DT>> | undefined,
> = DT extends "string"
  ? Schema extends { choices: any }
    ? ValueFromPromptSelectChoice<Schema["choices"][number]>
    : string
  : DT extends "boolean"
    ? boolean
    : DT extends "number"
      ? number
      : unknown;

export type DataTypeSchemaByToken<DT extends DataTypeToken = DataTypeToken> =
  DT extends "string"
    ? (
        | PromptTextOptions
        | (PromptSelectOptions<string> & {
            choices: PromptSelectChoice<string>[];
          })
      ) & { message?: string }
    : DT extends "boolean"
      ? PromptConfirmOptions & { message?: string }
      : DT extends "number"
        ? PromptNumberOptions & { message?: string }
        : {};
