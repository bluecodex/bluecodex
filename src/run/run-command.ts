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
    await command.fn({ argv, ...parsedArgv.data } as any);
    return 0;
  } catch (error) {
    process.stderr.write(
      ((error as Error).stack ?? (error as Error).message) + "\n",
    );
    return 1;
  }
}
