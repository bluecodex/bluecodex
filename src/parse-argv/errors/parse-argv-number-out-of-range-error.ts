import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";
import { ioc } from "../../ioc";

export class ParseArgvNumberOutOfRangeError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly range: { min: number | null; max: number | null },
    readonly input: number,
  ) {
    super();
  }

  get message() {
    const rangeText = ioc.theme.rangeText({
      min: this.range.min,
      max: this.range.max,
    });

    return `${this.field.__objectType__} ${this.field.name} expects a value ${rangeText}, ${this.input} given`;
  }
}
