import chalk from "chalk";

import { parseCliArgv } from "../cli/parse-cli-argv";
import { ioc } from "../ioc";

export async function runCommand(name: string, argv: string[]) {
  const command = ioc.registry.findCommand(name);
  if (!command) {
    console.log(ioc.theme.commandNotFound(name));
    return;
  }

  const parsedArgv = parseCliArgv({
    argv,
    blueprint: command.blueprint,
  });

  if (parsedArgv.type === "error") {
    // TODO: auto-collect missing input
    process.stderr.write(
      chalk.redBright("[error]") +
        " " +
        parsedArgv.errors.map((error) => error.message).join("\n") +
        "\n",
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
