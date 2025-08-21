import type { Command } from "../command/command";
import { commandBlue } from "../command/command.blue";
import { configBlue } from "../config/config.blue";
import { helpBlue } from "../help/help.blue";
import { ioc } from "../ioc";
import { linkBlue } from "../link/linkBlue";
import { Project } from "../project/project";
import { sourceAll } from "../registry/source-all";
import { run } from "../run/run";
import { runCommand } from "../run/run-command";
import { findProjectRoot } from "./find-project-root";
import { resolveBootParts } from "./resolve-boot-parts";

async function bootCli(): Promise<number | null> {
  const projectRoot = (await findProjectRoot()) ?? process.cwd();

  ioc.init({
    project: new Project(projectRoot),
  });

  // Register embedded commands
  ioc.registry.registerCommand(configBlue);
  ioc.registry.registerCommand(commandBlue);
  ioc.registry.registerCommand(linkBlue);
  ioc.registry.registerCommand(helpBlue);

  // Then enable self register
  ioc.registry.enableSelfRegister();

  const { name, argv, isCommandNotFoundHandle } = resolveBootParts(
    process.argv.slice(2),
  );

  await sourceAll();

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
if (exitCode) process.exitCode = exitCode;
