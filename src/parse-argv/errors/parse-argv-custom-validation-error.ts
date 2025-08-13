import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";

export class ParseArgvCustomValidationError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly value: unknown,
    readonly reason: string | null,
  ) {
    super();
  }

  get message() {
    return [
      `Value "${this.value}" did not pass validation for ${this.field.__objectType__}`,
      this.reason && `reason: ${this.reason}`,
    ]
      .filter(Boolean)
      .join(", ");
  }
}
