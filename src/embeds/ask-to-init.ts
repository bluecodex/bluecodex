import { ask } from "../ask/ask";
import { ioc } from "../ioc";
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
