import type {
  PromptConfirmOptions,
  PromptNumberOptions,
  PromptSelectChoice,
  PromptSelectOptions,
  PromptTextOptions,
  ValueFromPromptSelectChoice,
} from "../prompt/prompt";
import type { DataTypeToken } from "./data-type-token";

export type DataTypeSchema<DT extends DataTypeToken = DataTypeToken> =
  DT extends "string"
    ? (
        | PromptTextOptions
        | (PromptSelectOptions & {
            choices: PromptSelectChoice[];
          })
      ) & { message?: string }
    : DT extends "boolean"
      ? PromptConfirmOptions & { message?: string }
      : DT extends "number"
        ? PromptNumberOptions & { message?: string }
        : {};

export type DataTypeWithSchema<
  DT extends DataTypeToken,
  Schema extends DataTypeSchema<DT> | undefined,
> = DT extends "string"
  ? Schema extends { choices: any }
    ? ValueFromPromptSelectChoice<Schema["choices"][number]>
    : string
  : DT extends "boolean"
    ? boolean
    : DT extends "number"
      ? number
      : unknown;
