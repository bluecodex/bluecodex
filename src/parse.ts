import chalk from "chalk";
import { parseArgs as nodeParseArgs } from "node:util";
import type { ParseArgsOptionsConfig } from "util";

import { castArg } from "./arg";
import type { Blueprint, RecordFromBlueprint } from "./blueprint";
import { castFlag } from "./flag";

/*
 * Errors
 */

export class UnknownInput extends Error {
  input: string;

  constructor(input: string) {
    super();
    this.input = input;
  }

  get message() {
    return `${chalk.redBright(this.input)} is not recognized as an arg or flag.`;
  }
}

/*
 * Functions
 */

export function parse<B extends Blueprint>({
  argv,
  blueprint,
}: {
  argv: string[];
  blueprint: B;
}):
  | { type: "error"; errors: Error[] }
  | { type: "data"; data: RecordFromBlueprint<B> } {
  const parsedArgs = nodeParseArgs({
    args: argv,
    options: blueprint.flags.reduce(
      (acc, flag) => ({ ...acc, [flag.name]: { type: "string" } }),
      {} as ParseArgsOptionsConfig,
    ),
    allowPositionals: true,
  });

  const errors: Error[] = [];
  const dataAcc: Record<string, unknown> = {};

  blueprint.args.forEach((arg, index) => {
    try {
      dataAcc[arg.name] = castArg({
        arg,
        input: parsedArgs.positionals[index] ?? arg.fallback ?? "",
      });
    } catch (error) {
      errors.push(error as Error);
    }
  });

  blueprint.flags.forEach((flag) => {
    try {
      dataAcc[flag.name] = castFlag({
        flag,
        input: (parsedArgs.values[flag.name] ?? flag.fallback ?? "") as string,
      });
    } catch (error) {
      errors.push(error as Error);
    }
  });

  return errors.length > 0
    ? { type: "error", errors }
    : { type: "data", data: dataAcc as RecordFromBlueprint<B> };
}
