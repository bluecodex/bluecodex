import { bindBlue } from "../bind/bind.blue";
import type { Command } from "../command/command";
import { commandBlue } from "../command/command.blue";
import { helpBlue } from "../help/help.blue";
import { ioc } from "../ioc";
import { linkBlue } from "../link/link.blue";
import { Project } from "../project/project";
import { getDefaultSourcePatterns } from "../registry/default-source-patterns";
import { source } from "../registry/source";
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
  ioc.registry.registerCommand(helpBlue);
  ioc.registry.registerCommand(bindBlue);
  ioc.registry.registerCommand(linkBlue);
  ioc.registry.registerCommand(commandBlue);

  // Then enable self register
  ioc.registry.enableSelfRegister();

  const { name, argv, isCommandNotFoundHandle } = resolveBootParts(
    process.argv.slice(2),
  );

  for (const pattern of getDefaultSourcePatterns(projectRoot)) {
    await source(pattern);
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
if (exitCode) process.exitCode = exitCode;
