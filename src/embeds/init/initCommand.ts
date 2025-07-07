import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";

import { command } from "../../command/command";
import { ioc } from "../../ioc";

export const initCommand = command("init", async () => {
  const relativePath = ioc.project.relativeBluecodexFilePath;
  const absolutePath = ioc.project.bluecodexFilePath;

  if (ioc.project.bluecodexFileExists) {
    console.log(
      `There is already a bluecodex.ts file on your project at ${chalk.blueBright(relativePath)}`,
    );
    return;
  }

  const contents = fs
    .readFileSync(path.join(__dirname, "bluecodex.template.ts"), "utf-8")
    .replace('from "../../out/main";', 'from "bluecodex";');

  fs.writeFileSync(absolutePath, contents);

  console.log(`${relativePath} created`);
});
