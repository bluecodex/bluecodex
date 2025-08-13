import { parseArgs as nodeParseArgs } from "node:util";
import type { ParseArgsOptionDescriptor, ParseArgsOptionsConfig } from "util";

import type {
  RecordFromBlueprint,
  ValidBlueprint,
} from "../blueprint/blueprint";
import { falsyValues, truthyValues } from "../data-type/data-type-token";
import { assertInputValidForFieldAndSchema } from "./assert-input-valid-for-field-and-schema";
import { parseArgvArg } from "./parse-argv-arg";
import {
  type ParseArgvError,
  assertIsParseCliArgvError,
} from "./parse-argv-error";
import { parseArgvFlag } from "./parse-argv-flag";

export function parseArgv<VB extends ValidBlueprint>({
  argv,
  blueprint,
}: {
  argv: string[];
  blueprint: VB;
}):
  | { type: "data"; data: RecordFromBlueprint<VB> }
  | {
      type: "error";
      data: Partial<RecordFromBlueprint<VB>>;
      errors: ParseArgvError[];
    } {
  let parsedArgs: ReturnType<typeof nodeParseArgs>;

  const flags = blueprint.fields.filter(
    (part) => part.__objectType__ === "flag",
  );

  const args = blueprint.fields.filter((part) => part.__objectType__ === "arg");

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

      return { ...acc, [flag.name]: nodeParserFlag };
    }, {} as ParseArgsOptionsConfig),
  });

  const errors: ParseArgvError[] = [];
  const dataAcc: Record<string, unknown> = {};

  args.forEach((arg, index) => {
    try {
      const value = (dataAcc[arg.name] = parseArgvArg({
        arg,
        input: parsedArgs.positionals[index] ?? arg.fallback ?? "",
      }));

      if (value !== null) {
        assertInputValidForFieldAndSchema({
          field: arg,
          schema: blueprint.schema[arg.name] ?? {},
          value,
        });
      }

      dataAcc[arg.name] = value;
    } catch (error) {
      assertIsParseCliArgvError(error);
      errors.push(error);
    }
  });

  flags.forEach((flag) => {
    let rawValue = parsedArgs.values[flag.name];
    if (typeof rawValue === "boolean")
      rawValue = rawValue ? truthyValues[0] : falsyValues[0];

    try {
      const value = parseArgvFlag({
        flag,
        input: rawValue ?? flag.fallback ?? "",
      });

      if (value !== null) {
        assertInputValidForFieldAndSchema({
          field: flag,
          schema: blueprint.schema[flag.name] ?? {},
          value,
        });
      }

      dataAcc[flag.name] = value;
    } catch (error) {
      assertIsParseCliArgvError(error);
      errors.push(error);
    }
  });

  return errors.length > 0
    ? {
        type: "error",
        data: dataAcc as Partial<RecordFromBlueprint<VB>>,
        errors,
      }
    : { type: "data", data: dataAcc as RecordFromBlueprint<VB> };
}
