import chalk from "chalk";

import { prompt } from "../kit/prompt";
import { initCommand } from "./init/initCommand";

export async function askToInit() {
  console.log();
  console.log(
    `${chalk.white(`Welcome to ${chalk.blueBright("bluecodex")}`)}\n`,
  );
  const wantsToCreateFile = await prompt.bool(
    `${chalk.white("You don't have bluecodex.ts file yet. Would you like to")} create one?`,
  );

  if (wantsToCreateFile) {
    initCommand.fn({ argv: [] });
  } else {
    console.log("Ok then! See ya later.");
  }
}
