import type { DataTypeCastError } from "../../data-type/errors/data-type-cast-error";

export class FlagFallbackCastError<
  FlagName extends string,
  Err extends DataTypeCastError,
> extends Error {
  constructor(
    readonly flagName: FlagName,
    readonly error: Err,
  ) {
    super();
  }

  get message() {
    return `In flag "${this.flagName}": ${this.error.message}`;
  }
}
