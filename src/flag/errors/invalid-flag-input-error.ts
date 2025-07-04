import chalk from "chalk";

import type { Flag } from "../flag";

export class InvalidFlagInputError extends Error {
  constructor(
    readonly flag: Flag,
    readonly input: string,
  ) {
    super();
  }

  get message() {
    return `Invalid input ${chalk.redBright(this.input)} for flag ${chalk.bold(`${this.flag.name}:${this.flag.type}`)}`;
  }
}
