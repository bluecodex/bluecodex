import chalk from "chalk";

import type { Command } from "../command/command";
import { parseCliArgv } from "./parse-cli-argv";

export async function runCommand(
  command: Command,
  argv: string[],
): Promise<number> {
  const parsedArgv = parseCliArgv({
    argv,
    blueprint: command.blueprint,
  });

  if (parsedArgv.type === "error") {
    // TODO: auto-collect missing input
    process.stderr.write(
      parsedArgv.errors
        .map((error) => `${chalk.redBright("[error]")} ${error.message}`)
        .join("\n") + "\n",
    );

    return 1;
  }

  try {
    const response = await command.fn({ argv, ...parsedArgv.data } as any);

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
