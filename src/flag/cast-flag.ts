import { castData } from "../data-type/cast-data";
import type { DataType } from "../data-type/data-type";
import { InvalidFlagInputError } from "./errors/invalid-flag-input-error";
import { InvalidFlagTypeError } from "./errors/invalid-flag-type-error";
import { MissingRequiredFlagError } from "./errors/missing-required-flag-error";
import { type Flag } from "./flag";

type Args = {
  flag: Flag;
  input: string;
};

export function castFlag({ flag, input }: Args): DataType | null {
  if (flag.type instanceof InvalidFlagTypeError) {
    throw flag.type;
  }

  if (!input) {
    if (flag.required) throw new MissingRequiredFlagError(flag);

    return (flag.type === "boolean" ? false : null) as any;
  }

  try {
    return castData({ type: flag.type, input }) as any;
  } catch {
    throw new InvalidFlagInputError(flag, input);
  }
}
