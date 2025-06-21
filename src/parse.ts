import chalk from "chalk";
import { parseArgs as nodeParseArgs } from "node:util";
import type { ParseArgsOptionsConfig } from "util";

import { castArg } from "./arg";
import {
  type Blueprint,
  type RecordFromBlueprint,
  isArgPart,
  isFlagPart,
} from "./blueprint";
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
  let parsedArgs: ReturnType<typeof nodeParseArgs>;

  const flags = blueprint.parts.filter(isFlagPart);
  const args = blueprint.parts.filter(isArgPart);

  try {
    parsedArgs = nodeParseArgs({
      args: argv,
      options: flags.reduce(
        (acc, flag) => ({
          ...acc,
          [flag.name]: {
            type: "string",
            short: flag.short === true ? flag.name : flag.short || undefined,
          },
        }),
        {} as ParseArgsOptionsConfig,
      ),
      allowPositionals: true,
    });
  } catch (error) {
    // TODO: use custom error
    return { type: "error", errors: [error as Error] };
  }

  const errors: Error[] = [];
  const dataAcc: Record<string, unknown> = {};

  args.forEach((arg, index) => {
    try {
      dataAcc[arg.name] = castArg({
        arg,
        input: parsedArgs.positionals[index] ?? arg.fallback ?? "",
      });
    } catch (error) {
      errors.push(error as Error);
    }
  });

  flags.forEach((flag) => {
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
