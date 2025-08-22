import os from "node:os";

import { file } from "../file/file";

export function configFile(filename: "shell.sh" | "resolver.js" | "links.txt") {
  return file(os.homedir(), ".config/bluecodex", filename);
}
