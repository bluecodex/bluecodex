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
}): F["type"] extends DataTypeToken
  ? DataTypeByToken<F["type"]> | null
  : F["type"] {
  if (flag.type instanceof InvalidFlagTypeError) {
    throw flag.type;
  }

  if (!input) {
    if (flag.required) {
      throw new MissingRequiredFlagError(flag);
    } else {
      return (flag.type === "boolean" ? false : null) as any;
    }
  }

  try {
    return castData({ type: flag.type, input }) as any;
  } catch {
    throw new InvalidFlagInputError(flag, input);
  }
}
