import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";

import { command } from "../../command/command";
import { ioc } from "../../ioc";

export const initCommand = command("init", async () => {
  if (ioc.project.isInitialized) {
    console.log(
      `You've already initialized this project, these are the files sourced:`,
    );

    ioc.project.sources.forEach((source) => {
      console.log(`- ${source}`);
    });

    return;
  }

  const contents = fs
    .readFileSync(path.join(__dirname, "init-ask.template.ts"), "utf-8")
    .replace('from "../../out/main";', 'from "bluecodex";');

  ioc.project.ensureBlueFolderExists();
  const filePath = path.join(ioc.project.blueFolderPath, "ask.blue.ts");
  fs.writeFileSync(filePath, contents);

  console.log(
    `${chalk.greenBright(ioc.project.relativePath(filePath))} created`,
  );
});
