import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";

export class ParseArgvCustomValidationError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly input: unknown,
    readonly reason: string | null,
  ) {
    super();
  }

  get message() {
    return [
      `Value "${this.input}" did not pass validation for ${this.field.__objectType__}`,
      this.reason && `reason: ${this.reason}`,
    ]
      .filter(Boolean)
      .join(", ");
  }
}
