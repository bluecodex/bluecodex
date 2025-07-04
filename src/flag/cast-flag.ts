import { castData } from "../data-type/cast-data";
import type {
  DataTypeByToken,
  DataTypeToken,
} from "../data-type/data-type-constants";
import { InvalidFlagInputError } from "./errors/invalid-flag-input-error";
import { InvalidFlagTypeError } from "./errors/invalid-flag-type-error";
import { MissingRequiredFlagError } from "./errors/missing-required-flag-error";
import { type Flag } from "./flag";

export function castFlag<F extends Flag>({
  flag,
  input,
}: {
  flag: F;
  input: string;
}): DataTypeByToken<F["type"] & DataTypeToken> {
  if (flag.type instanceof InvalidFlagTypeError) {
    throw flag.type;
  }

  if (flag.required && !input) {
    throw new MissingRequiredFlagError(flag);
  }

  try {
    return castData({ type: flag.type, input }) as DataTypeByToken<
      F["type"] & DataTypeToken
    >;
  } catch {
    throw new InvalidFlagInputError(flag, input);
  }
}
