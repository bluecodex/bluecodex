import { askToInit } from "../embeds/ask-to-init";
import { embeddedCommands } from "../embeds/embeds";
import { initCommand } from "../embeds/init/init-command";
import { ioc } from "../ioc";
import { Project } from "../project/project";
import { source } from "../registry/source";
import { runCommand } from "../run/run-command";
import { themedProjectName } from "../theme/themedProjectName";

async function bootCli(): Promise<number> {
  ioc.init({
    project: new Project({ path: process.cwd() }),
  });

  embeddedCommands.forEach((cmd) => ioc.registry.registerCommand(cmd));
  ioc.registry.selfRegisterCommandEnabled = true;

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

  const command = ioc.registry.findCommand(name);
  if (!command) {
    process.stderr.write(ioc.theme.commandNotFound(name) + "\n");
    return 1;
  }

  return runCommand(command, remainingArgv);
}

process.exitCode = await bootCli();
