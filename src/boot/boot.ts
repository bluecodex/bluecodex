import { parseCliArgv } from "../cli/parse-cli-argv";
import { runCommand } from "../command/run-command";
import { askToInit } from "../embeds/ask-to-init";
import { embeddedCommands } from "../embeds/embeds";
import { ioc } from "../ioc";
import { Project } from "../project/project";

async function bootCli() {
  ioc.init({
    project: new Project({ path: process.cwd() }),
  });

  embeddedCommands.forEach((cmd) => ioc.commandRegistry.register(cmd));
  ioc.commandRegistry.selfRegisterEnabled = true;

  if (!ioc.project.bluecodexFileExists) {
    await askToInit();
    return;
  }

  // Load bluecodex.ts file
  await import(ioc.project.bluecodexFilePath);

  const [firstArgv, ...remainingArgv] = process.argv.slice(2);

  const name = firstArgv ?? "help";

  await runCommand(name, remainingArgv);
}

await bootCli();
