import type { ValidArg } from "../arg/arg";
import { castData } from "../data-type/cast-data";
import type { DataType } from "../data-type/data-type";
import { ParseArgvMalformattedInputError } from "../parse-argv/errors/parse-argv-malformatted-input-error";
import { ParseArgvMissingRequiredFieldError } from "./errors/parse-argv-missing-required-field-error";

type Args<VA extends ValidArg> = {
  arg: VA;
  input: string;
};

export function parseArgvArg<VA extends ValidArg>({
  arg,
  input,
}: Args<VA>): DataType<VA["type"]> | null {
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
