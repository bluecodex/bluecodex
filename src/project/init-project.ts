import * as fs from "node:fs";
import * as path from "node:path";

import { ioc } from "../ioc";

export function initProject() {
  // create .blue folder
  fs.mkdirSync(ioc.project.blueFolderPath);

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
      "",
    ].join("\n"),
  );
  console.log(ioc.theme.fileCreated(localGitIgnoreFilePath));
}
