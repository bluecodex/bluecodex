import { parseCliArgv } from "./cli";
import { askToInit } from "./embeds/ask-to-init";
import { embeddedCommands } from "./embeds/embeds";
import { ioc } from "./ioc";
import { Project } from "./project";

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
  require(ioc.project.bluecodexFilePath);

  const [firstArgv, ...remainingArgv] = process.argv.slice(2);

  const name = firstArgv ?? "help";

  const command = ioc.commandRegistry.find(name || "list");
  if (!command) {
    console.error("Command not found");
    return;
  }

  const result = parseCliArgv({
    argv: remainingArgv,
    blueprint: command.blueprint,
  });

  if (result.type === "error") {
    console.log(result.errors.map((error) => error.message).join("\n"));
    return;
  }

  await command.fn({ argv: remainingArgv, ...result.data } as any);
}

await bootCli();
