import { ioc } from "../ioc";
import { prompt } from "../kit/prompt";
import { initCommand } from "./init/init-command";

export async function askToInit() {
  const wantsToInit = await prompt.bool(
    `Would you like to ${ioc.theme.blueprintName(initCommand.blueprint)} kick things off?`,
  );

  if (wantsToInit) {
    initCommand.fn({ argv: [] });
  } else {
    console.log("Ok then! See ya later.");
  }
}
