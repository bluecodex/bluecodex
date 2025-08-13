import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";
import { ioc } from "../../ioc";

export class ParseArgvNumberOutOfRangeError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly range: { min: number | null; max: number | null },
    readonly value: number,
  ) {
    super();
  }

  private get rangeText() {
    return ioc.theme.rangeText({
      min: this.range.min,
      max: this.range.max,
    });
  }

  get message() {
    return `${this.field.__objectType__} ${this.field.name} expects a value ${this.rangeText}, ${this.value} given`;
  }

  get reason() {
    return `must be ${this.rangeText}`;
  }
}
