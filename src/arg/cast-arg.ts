import { castData } from "../data-type/cast-data";
import type {
  DataTypeByToken,
  DataTypeToken,
} from "../data-type/data-type-constants";
import type { Arg } from "./arg";
import { InvalidArgInputError } from "./errors/invalid-arg-input-error";
import { InvalidArgTypeError } from "./errors/invalid-arg-type-error";
import { MissingRequiredArgError } from "./errors/missing-required-arg-error";

export function castArg<A extends Arg>({
  arg,
  input,
}: {
  arg: A;
  input: string;
}): A["type"] extends DataTypeToken ? DataTypeByToken<A["type"]> : A["type"] {
  if (arg.type instanceof InvalidArgTypeError) {
    throw arg.type;
  }

  if (!arg.optional && !input) {
    throw new MissingRequiredArgError(arg);
  }

  try {
    return castData({ type: arg.type, input }) as any;
  } catch {
    throw new InvalidArgInputError(arg, input);
  }
}
