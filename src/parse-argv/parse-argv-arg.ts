import type { ValidArg } from "../arg/arg";
import { castData } from "../data-type/cast-data";
import type { DataType } from "../data-type/data-type";
import { ParseArgvMalformattedInputError } from "../parse-argv/errors/parse-argv-malformatted-input-error";
import { ParseArgvMissingRequiredFieldError } from "./errors/parse-argv-missing-required-field-error";

type Args = {
  arg: ValidArg;
  input: string;
};

export function parseArgvArg({ arg, input }: Args): DataType | null {
  if (!input) {
    if (!arg.optional) throw new ParseArgvMissingRequiredFieldError(arg);
    return null;
  }

  try {
    return castData({ type: arg.type, input }) as any;
  } catch {
    throw new ParseArgvMalformattedInputError(arg, input);
  }
}
