import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";

export class ParseArgvInvalidChoiceError extends Error {
  constructor(
    readonly field: ValidArg | ValidFlag,
    readonly choices: string[],
    readonly value: string,
  ) {
    super();
  }

  get message() {
    return `Invalid choice "${this.value}" for ${this.field.__objectType__} ${this.field.name}. Valid choices: ${this.choices.join(", ")}`;
  }

  get reason() {
    return "invalid choice";
  }
}
