import os from "node:os";
import path from "node:path";

export function getLinksFilePath() {
  return path.resolve(os.homedir(), ".config/bluecodex/links.txt");
}
