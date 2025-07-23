import { runCommand } from "../command/run-command";
import { askToInit } from "../embeds/ask-to-init";
import { embeddedCommands } from "../embeds/embeds";
import { initCommand } from "../embeds/init/init-command";
import { ioc } from "../ioc";
import { source } from "../kit/source";
import { Project } from "../project/project";
import { themedProjectName } from "../theme/themedProjectName";

async function bootCli() {
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

      await askToInit();

      return;
    }
  }

  for (const defaultSource of ioc.project.sources) {
    await source(defaultSource);
  }

  const exitCode = await runCommand(name, remainingArgv);
  process.exitCode = exitCode;
}

await bootCli();
