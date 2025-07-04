import type { DataTypeCastError } from "../../data-type/errors/data-type-cast-error";

export class ArgFallbackCastError<
  ArgName extends string,
  Err extends DataTypeCastError,
> extends Error {
  constructor(
    readonly argName: ArgName,
    readonly error: Err,
  ) {
    super();
  }

  get message() {
    return `In arg "${this.argName}": ${this.error.message}`;
  }
}
