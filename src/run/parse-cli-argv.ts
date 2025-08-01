import { parseArgs as nodeParseArgs } from "node:util";
import type { ParseArgsOptionDescriptor, ParseArgsOptionsConfig } from "util";

import { castArg } from "../arg/cast-arg";
import { InvalidArgInputError } from "../arg/errors/invalid-arg-input-error";
import { MissingRequiredArgError } from "../arg/errors/missing-required-arg-error";
import type { Blueprint, RecordFromBlueprint } from "../blueprint/blueprint";
import { falsyValues, truthyValues } from "../data-type/data-type-constants";
import { castFlag } from "../flag/cast-flag";

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

  const flags = blueprint.parts.filter(
    (part) => part.__objectType__ === "flag",
  );

  const args = blueprint.parts.filter((part) => part.__objectType__ === "arg");

  try {
    parsedArgs = nodeParseArgs({
      args: argv,
      allowPositionals: true,
      options: flags.reduce((acc, flag) => {
        const nodeParserFlag: ParseArgsOptionDescriptor = {
          type: flag.type === "boolean" ? "boolean" : "string",
        };

        if (flag.short === true) {
          nodeParserFlag.short = flag.name;
        } else if (typeof flag.short === "string") {
          nodeParserFlag.short = flag.short;
        }

        return {
          ...acc,
          [flag.name]: nodeParserFlag,
        };
      }, {} as ParseArgsOptionsConfig),
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
    if (typeof value === "boolean")
      value = value ? truthyValues[0] : falsyValues[0];

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
