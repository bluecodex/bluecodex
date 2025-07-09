import chalk from "chalk";

import { runCommand } from "../command/run-command";
import { askToInit } from "../embeds/ask-to-init";
import { embeddedCommands } from "../embeds/embeds";
import { initCommand } from "../embeds/init/init-command";
import { ioc } from "../ioc";
import { Project } from "../project/project";

async function bootCli() {
  ioc.init({
    project: new Project({ path: process.cwd() }),
  });

  embeddedCommands.forEach((cmd) => ioc.registry.register(cmd));
  ioc.registry.selfRegisterEnabled = true;

  const [firstArgv, ...remainingArgv] = process.argv.slice(2);
  const name = firstArgv ?? "help";

  if (name !== initCommand.blueprint.name) {
    if (!ioc.project.isInitialized) {
      console.log();
      console.log(`Welcome to ${chalk.blueBright("bluecodex")}\n`);

      await askToInit();

      return;
    }
  }

  for (const defaultSource of ioc.project.sources) {
    await import(defaultSource);
  }

  await runCommand(name, remainingArgv);
}

await bootCli();
