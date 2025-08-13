import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";

export class ParseArgvNumberCannotFloatError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly value: number,
  ) {
    super();
  }

  get message() {
    return `${this.field.__objectType__} expects an integer, ${this.value} given`;
  }
}
