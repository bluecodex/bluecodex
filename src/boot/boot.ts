import type { Command } from "../command/command";
import { helpCommand } from "../help/help-command";
import { ioc } from "../ioc";
import { proactivelyRunProjectCommand } from "../project/proactively-run-project-command";
import { Project } from "../project/project";
import { defaultSourcePatterns } from "../registry/default-source-patterns";
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

  ioc.registry.registerCommand(helpCommand);

  ioc.registry.enableSelfRegister();

  const { name, argv, isCommandNotFoundHandle } = resolveBootParts(
    process.argv.slice(2),
  );

  for (const pattern of defaultSourcePatterns) {
    await source(pattern);
  }

  if (await proactivelyRunProjectCommand()) return 0;

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
