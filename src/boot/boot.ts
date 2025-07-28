import type { Command } from "../command/command";
import { askToInit } from "../embeds/ask-to-init";
import { embeddedCommands } from "../embeds/embeds";
import { initCommand } from "../embeds/init/init-command";
import { ioc } from "../ioc";
import { Project } from "../project/project";
import { source } from "../registry/source";
import { run } from "../run/run";
import { runCommand } from "../run/run-command";
import { themedProjectName } from "../theme/themedProjectName";

async function bootCli(): Promise<number | null> {
  ioc.init({
    project: new Project({ path: process.cwd() }),
  });

  embeddedCommands.forEach((cmd) => ioc.registry.registerCommand(cmd));
  ioc.registry.selfRegisterEnabled = true;

  const [firstArgv, ...remainingArgv] = process.argv.slice(2);
  const name = firstArgv ?? "help";

  if (name !== initCommand.blueprint.name) {
    if (!ioc.project.isInitialized) {
      console.log();
      console.log(`Welcome to ${themedProjectName}\n`);

      return askToInit();
    }
  }

  for (const defaultSource of ioc.project.sources) {
    await source(defaultSource);
  }

  const commandOrAlias = ioc.registry.findCommandOrAlias(name);
  if (!commandOrAlias) {
    process.stderr.write(ioc.theme.commandOrAliasNotFound(name) + "\n");
    return 1;
  }

  let command: Command;

  if (commandOrAlias.__objectType__ === "command") {
    command = commandOrAlias;
  } else {
    // commandOrAlias is an alias
    const alias = commandOrAlias;

    const aliasedCommand = ioc.registry.findAliasedCommand(alias);

    if (aliasedCommand) command = aliasedCommand;
    else {
      const { exitCode } = await run(alias.target);
      return exitCode;
    }
  }

  return runCommand(command, remainingArgv);
}

const exitCode = await bootCli();
process.exitCode = exitCode ?? 1;
