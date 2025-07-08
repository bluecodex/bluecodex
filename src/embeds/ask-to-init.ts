import chalk from "chalk";

import { prompt } from "../kit/prompt";
import { initCommand } from "./init/initCommand";

export async function askToInit() {
  const wantsToInit = await prompt.bool(
    `Would you like to ${chalk.yellowBright("bcx init")} kick things off?`,
  );

  if (wantsToInit) {
    initCommand.fn({ argv: [] });
  } else {
    console.log("Ok then! See ya later.");
  }
}
