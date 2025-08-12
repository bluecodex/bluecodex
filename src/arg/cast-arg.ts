import { castData } from "../data-type/cast-data";
import type { DataType } from "../data-type/data-type";
import type { Arg } from "./arg";
import { InvalidArgInputError } from "./errors/invalid-arg-input-error";
import { InvalidArgTypeError } from "./errors/invalid-arg-type-error";
import { MissingRequiredArgError } from "./errors/missing-required-arg-error";

type Args = {
  arg: Arg;
  input: string;
};

export function castArg({ arg, input }: Args): DataType | null {
  if (arg.type instanceof InvalidArgTypeError) {
    throw arg.type;
  }

  if (!input) {
    if (!arg.optional) throw new MissingRequiredArgError(arg);
    return null;
  }

  try {
    return castData({ type: arg.type, input }) as any;
  } catch {
    throw new InvalidArgInputError(arg, input);
  }
}
