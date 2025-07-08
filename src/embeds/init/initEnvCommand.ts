import chalk from "chalk";
import fs from "node:fs";

import { command } from "../../command/command";
import { ioc } from "../../ioc";

export const initEnvCommand = command("init:env", () => {
  const { dotEnvPath, dotEnvTemplatePath } = ioc.environmentManager;

  if (!ioc.environmentManager.canInitialize) {
    console.log(
      `There is no ${chalk.yellowBright(ioc.project.relativePath(dotEnvTemplatePath))} file so there is not need for a .env file.`,
    );
    return;
  }

  if (ioc.environmentManager.isInitialized) {
    console.log(`You've already initialized your environment.\n`);
    console.log(
      `Take a look at ${chalk.greenBright(ioc.environmentManager.dotEnvPath)}`,
    );

    return;
  }

  const contents = fs.readFileSync(dotEnvTemplatePath);

  ioc.project.ensureDotBluecodexFolderExists();
  fs.writeFileSync(dotEnvPath, contents);
  console.log(`${ioc.project.relativePath(dotEnvPath)} created`);
});
