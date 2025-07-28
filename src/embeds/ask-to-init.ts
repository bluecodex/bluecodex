import { ioc } from "../ioc";
import { ask } from "../kit/ask";
import { runCommand } from "../run/run-command";
import { initCommand } from "./init/init-command";

export async function askToInit() {
  const wantsToInit = await ask.bool(
    `Would you like to ${ioc.theme.commandName(initCommand)} kick things off?`,
  );

  if (wantsToInit) {
    return runCommand(initCommand, []);
  } else {
    console.log("Ok then! See ya later.");
    return 0;
  }
}
