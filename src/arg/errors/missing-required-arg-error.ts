import chalk from "chalk";

import type { Arg } from "../arg";

export class MissingRequiredArgError extends Error {
  constructor(readonly arg: Arg) {
    super();
  }

  get message() {
    return `Arg ${chalk.bold(`${this.arg.name}:${this.arg.type}`)} is not optional and was not provided.`;
  }
}
