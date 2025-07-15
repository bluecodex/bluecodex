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

  // create .blue folder
  fs.mkdirSync(ioc.project.blueFolderPath);

  // create base readme
  const readmePath = path.join(ioc.project.blueFolderPath, "blue.md");
  fs.copyFileSync(path.join(__dirname, "init-blue.template.md"), readmePath);
  console.log(ioc.theme.fileCreated(readmePath));

  // example .blue file
  const filePath = path.join(ioc.project.blueFolderPath, "ask.blue.ts");

  const contents = fs
    .readFileSync(path.join(__dirname, "init-ask.template.ts"), "utf-8")
    .replace('from "../../out/main";', 'from "bluecodex";');

  fs.writeFileSync(filePath, contents);
  console.log(ioc.theme.fileCreated(filePath));

  // .gitignore
  const localGitIgnoreFilePath = path.join(
    ioc.project.localBlueFolderPath,
    ".gitignore",
  );

  fs.mkdirSync(ioc.project.localBlueFolderPath);
  fs.writeFileSync(
    localGitIgnoreFilePath,
    [
      "# You can use this folder to make customizations",
      "# or experiment with new commands before you share with your team.",
      "",
      "# Files in this folder are not tracked on git",
      "*",
      "!.gitignore",
    ].join("\n"),
  );
  console.log(ioc.theme.fileCreated(localGitIgnoreFilePath));
});
