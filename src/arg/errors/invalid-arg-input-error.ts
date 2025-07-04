import chalk from "chalk";

import type { Arg } from "../arg";

export class InvalidArgInputError extends Error {
  constructor(
    readonly arg: Arg,
    readonly input: string,
  ) {
    super();
  }

  get message() {
    return `Invalid input ${chalk.redBright(this.input)} for arg ${chalk.bold(`${this.arg.name}:${this.arg.type}`)}`;
  }
}
