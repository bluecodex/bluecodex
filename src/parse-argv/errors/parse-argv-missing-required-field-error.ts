import chalk from "chalk";

import type { ValidArg } from "../../arg/arg";
import type { ValidFlag } from "../../flag/flag";

export class ParseArgvMissingRequiredFieldError extends Error {
  constructor(readonly field: ValidArg | ValidFlag) {
    super();
  }

  get message() {
    return `${this.field.__objectType__} ${chalk.bold(`${this.field.name}:${this.field.type}`)} is required and was not provided.`;
  }

  get reason() {
    return "is required and was not provided";
  }
}
