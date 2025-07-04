import chalk from "chalk";

import type { Flag } from "../flag";

export class MissingRequiredFlagError extends Error {
  constructor(readonly flag: Flag) {
    super();
  }

  get message() {
    return `Flag ${chalk.bold(`${this.flag.name}:${this.flag.type}`)} is not optional and was not provided.`;
  }
}
