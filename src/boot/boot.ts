import chalk from "chalk";

import { runCommand } from "../command/run-command";
import { askToInit } from "../embeds/ask-to-init";
import { askToInitEnv } from "../embeds/ask-to-init-env";
import { embeddedCommands } from "../embeds/embeds";
import { initCommand } from "../embeds/init/initCommand";
import { initEnvCommand } from "../embeds/init/initEnvCommand";
import { ioc } from "../ioc";
import { Project } from "../project/project";

async function bootCli() {
  ioc.init({
    project: new Project({ path: process.cwd() }),
  });

  embeddedCommands.forEach((cmd) => ioc.commandRegistry.register(cmd));
  ioc.commandRegistry.selfRegisterEnabled = true;

  const [firstArgv, ...remainingArgv] = process.argv.slice(2);
  const name = firstArgv ?? "help";

  if (
    name !== initCommand.blueprint.name &&
    name !== initEnvCommand.blueprint.name
  ) {
    const wasInitialized = ioc.project.isInitialized;
    const wasEnvInitialized = ioc.environmentManager.isInitialized;

    if (!wasInitialized || !wasEnvInitialized) {
      console.log();
      console.log(`Welcome to ${chalk.blueBright("bluecodex")}\n`);

      if (wasInitialized) {
        console.log(
          "Someone one your team setup bluecodex already, you just have to init your environment.\n",
        );

        await askToInitEnv();
      } else {
        console.log(`Let's get you started with bluecodex.\n`);
        await askToInit();
      }

      return;
    }
  }

  for (const defaultSource of ioc.project.defaultSources) {
    await import(defaultSource);
  }

  await runCommand(name, remainingArgv);
}

await bootCli();
