import { castData } from "../data-type/cast-data";
import type { DataType } from "../data-type/data-type";
import type { ValidFlag } from "../flag/flag";
import { ParseArgvMalformattedInputError } from "./errors/parse-argv-malformatted-input-error";
import { ParseArgvMissingRequiredFieldError } from "./errors/parse-argv-missing-required-field-error";

type Args = {
  flag: ValidFlag;
  input: string;
};

export function parseArgvFlag({ flag, input }: Args): DataType | null {
  if (!input) {
    if (flag.required) throw new ParseArgvMissingRequiredFieldError(flag);

    return (flag.type === "boolean" ? false : null) as any;
  }

  try {
    return castData({ type: flag.type, input }) as any;
  } catch {
    throw new ParseArgvMalformattedInputError(flag, input);
  }
}
