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
import { resolveBootParts } from "./resolve-boot-parts";

async function bootCli(): Promise<number | null> {
  ioc.init({
    project: new Project({ path: process.cwd() }),
  });

  embeddedCommands.forEach((cmd) => ioc.registry.registerCommand(cmd));
  ioc.registry.selfRegisterEnabled = true;

  const { name, argv, isCommandNotFoundHandle } = resolveBootParts(
    process.argv.slice(2),
  );

  if (name !== initCommand.blueprint.name && !ioc.project.isInitialized) {
    console.log();
    console.log(`Welcome to ${themedProjectName}\n`);

    return askToInit();
  }

  for (const defaultSource of ioc.project.sources) {
    await source(defaultSource);
  }

  const commandOrAlias = ioc.registry.findCommandOrAlias(name);
  if (!commandOrAlias) {
    if (isCommandNotFoundHandle) return 127;

    process.stderr.write(ioc.theme.commandOrAliasNotFound(name) + "\n");
    return 1;
  }

  let command: Command;

  if (commandOrAlias.__objectType__ === "command") {
    command = commandOrAlias;
  } else {
    // commandOrAlias is an alias
    const alias = commandOrAlias;

    const { exitCode } = await run([alias.target, argv]);
    return exitCode;
  }

  return runCommand(command, argv);
}

const exitCode = await bootCli();
process.exitCode = exitCode ?? 1;
