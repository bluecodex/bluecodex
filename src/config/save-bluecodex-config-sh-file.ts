import os from "node:os";
import path from "node:path";

import { configFile } from "./config-file";

export async function saveBluecodexConfigShFile(aliasName: string) {
  const resolverJsFile = configFile("resolver.js");
  const resolverJsFilePathRelativeToHome =
    "~/" + path.relative(os.homedir(), resolverJsFile.path);

  const shellShFile = configFile("shell.sh");
  await shellShFile.save([
    `alias ${aliasName}="${resolverJsFilePathRelativeToHome}"`,
  ]);
}
