import chalk from "chalk";
import { parseArgs as nodeParseArgs } from "node:util";
import type { ParseArgsOptionsConfig } from "util";

import { InvalidArgInputError, MissingRequiredArgError, castArg } from "./arg";
import {
  type Blueprint,
  type RecordFromBlueprint,
  isArg,
  isFlag,
} from "./blueprint";
import { castFlag } from "./flag";

/*
 * Errors
 */

export class UnknownInput extends Error {
  constructor(readonly input: string) {
    super();
  }

  get message() {
    return `${chalk.redBright(this.input)} is not recognized as an arg or flag.`;
  }
}

/*
 * Functions
 */

export function parseCliArgv<B extends Blueprint>({
  argv,
  blueprint,
}: {
  argv: string[];
  blueprint: B;
}):
  | { type: "error"; errors: Error[] }
  | { type: "data"; data: RecordFromBlueprint<B> } {
  let parsedArgs: ReturnType<typeof nodeParseArgs>;

  const flags = blueprint.parts.filter(isFlag);
  const args = blueprint.parts.filter(isArg);

  try {
    parsedArgs = nodeParseArgs({
      args: argv,
      options: flags.reduce(
        (acc, flag) => ({
          ...acc,
          [flag.name]: {
            type: "string",
            short:
              flag.short === true
                ? flag.name
                : typeof flag.short === "string"
                  ? flag.short
                  : undefined,
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
      if (
        error instanceof InvalidArgInputError ||
        error instanceof MissingRequiredArgError
      )
        errors.push(error);
      else throw error;
    }
  });

  flags.forEach((flag) => {
    let value = parsedArgs.values[flag.name];

    // if the flag is provided with no value, that means true
    // example: foo bar -d
    if (flag.type === "boolean" && typeof value !== "undefined") value = true;

    try {
      dataAcc[flag.name] = castFlag({
        flag,
        input: value ?? flag.fallback ?? "",
      });
    } catch (error) {
      errors.push(error as Error);
    }
  });

  return errors.length > 0
    ? { type: "error", errors }
    : { type: "data", data: dataAcc as RecordFromBlueprint<B> };
}
