import { parseCliArgv } from "../cli/parse-cli-argv";
import { ioc } from "../ioc";

export async function runCommand(name: string, argv: string[]) {
  const command = ioc.registry.findCommand(name);
  if (!command) {
    console.log(ioc.theme.commandNotFound(name));
    return;
  }

  const result = parseCliArgv({
    argv,
    blueprint: command.blueprint,
  });

  if (result.type === "error") {
    console.log(result.errors.map((error) => error.message).join("\n"));
    return;
  }

  await command.fn({ argv, ...result.data } as any);
}
