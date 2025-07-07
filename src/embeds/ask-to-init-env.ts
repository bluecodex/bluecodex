import chalk from "chalk";

import { ioc } from "../ioc";
import { prompt } from "../kit/prompt";
import { initEnvCommand } from "./init/initEnvCommand";

export async function askToInitEnv() {
  const wantsToInitEnv = await prompt.bool(
    `Would you like to ${chalk.yellowBright("෴ bcx init:env")} to prepare your environment?`,
  );

  if (wantsToInitEnv) {
    initEnvCommand.fn({ argv: [] });
  } else {
    ioc.settingsManager.setSetting("skipInitEnv", true);

    console.log(
      'Ok then! If you change your mind you can run ${chalk.blueBright("bcx init:env")}.',
    );
  }
}
