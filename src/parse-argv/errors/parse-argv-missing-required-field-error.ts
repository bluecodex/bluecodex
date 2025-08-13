import chalk from "chalk";

import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";

export class ParseArgvMissingRequiredFieldError extends Error {
  constructor(readonly field: ValidArg | ValidFlag) {
    super();
  }

  get message() {
    return `Arg ${chalk.bold(`${this.field.name}:${this.field.type}`)} is not optional and was not provided.`;
  }
}
