import type { Arg } from "../arg/arg";
import { InvalidArgInputError } from "../arg/errors/invalid-arg-input-error";
import { InvalidArgTypeError } from "../arg/errors/invalid-arg-type-error";
import { MissingRequiredArgError } from "../arg/errors/missing-required-arg-error";
import type { Command } from "../command/command";
import { InvalidFlagInputError } from "../flag/errors/invalid-flag-input-error";
import { InvalidFlagTypeError } from "../flag/errors/invalid-flag-type-error";
import { MissingRequiredFlagError } from "../flag/errors/missing-required-flag-error";
import type { Flag } from "../flag/flag";
import { promptPart } from "../prompt/prompt-part";
import { parseCliArgv } from "./parse-cli-argv";

export async function runCommand(
  command: Command,
  argv: string[],
): Promise<number> {
  const parsedArgv = parseCliArgv({
    argv,
    blueprint: command.blueprint,
  });

  const { data } = parsedArgv;

  if (parsedArgv.type === "error") {
    for (const error of parsedArgv.errors) {
      let part: Arg | Flag | null = null;

      if (
        error instanceof InvalidArgInputError ||
        error instanceof MissingRequiredArgError
      ) {
        part = error.arg;
      } else if (
        error instanceof InvalidFlagInputError ||
        error instanceof MissingRequiredFlagError
      ) {
        part = error.flag;
      } else {
        // this should never happen, but if it happens, throw error
        throw error;
      }

      if (part) {
        // TODO: create "ValidArg" and "ValidFlag" types
        if (
          part.type instanceof InvalidArgTypeError ||
          part.type instanceof InvalidFlagTypeError
        )
          throw part.type;

        data[part.name] = (await promptPart({
          type: part.type,
          name: part.name,
          schema: command.blueprint.schema[part.name] ?? {},
        })) as any;
      }
    }
  }

  try {
    const response = await command.fn({ argv, ...data } as any);

    // If an exit code number is returned, use it
    if (typeof response === "number") return response;

    // If it's a boolean, true means success and false means failure
    if (typeof response === "boolean") return response ? 0 : 1;

    // If it's a run-result, use the exit code
    if (
      response &&
      typeof response === "object" &&
      (response.__objectType__ === "run-result" ||
        response.__objectType__ === "run-result-with-output")
    )
      return response.exitCode ?? 0;

    return 0;
  } catch (error) {
    process.stderr.write(
      ((error as Error).stack ?? (error as Error).message) + "\n",
    );
    return 1;
  }
}
