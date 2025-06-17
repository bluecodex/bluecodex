import { askToInit } from "./embeds/ask-to-init";
import { embeds } from "./embeds/embeds";
import { ioc } from "./ioc";
import { Project } from "./project";

async function boot() {
  ioc.init({
    project: new Project({ path: process.cwd() }),
  });

  embeds.forEach((cmd) => ioc.commandRegistry.register(cmd));
  ioc.commandRegistry.selfRegisterEnabled = true;

  if (!ioc.project.bluecodexFileExists) {
    await askToInit();
    return;
  }

  require(ioc.project.bluecodexFilePath);

  const [name, ...cmdArgv] = process.argv.slice(2);

  const command = ioc.commandRegistry.find(name || "list");
  if (command) {
    await command.fn({ argv: cmdArgv });
  } else {
    console.error("Command not found");
  }
}

await boot();
