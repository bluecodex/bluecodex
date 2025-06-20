import { askToInit } from "./embeds/ask-to-init";
import { embeds } from "./embeds/embeds";
import { ioc } from "./ioc";
import { parse } from "./parse";
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
  if (!command) {
    console.error("Command not found");
    return;
  }

  const result = parse({ argv: cmdArgv, blueprint: command?.blueprint });
  if (result.type === "error") {
    console.log(result.errors.map((error) => error.message).join("\n"));
    return;
  }

  await command.fn({ argv: cmdArgv, ...result.data });
}

await boot();
