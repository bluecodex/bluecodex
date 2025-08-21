import path from "node:path";

import { fileExists } from "../utils/fileExists";

export async function getBluecodexBinFromProjectRoot(projectRoot: string) {
  const binPath = path.join(projectRoot, "node_modules/.bin/bluecodex");
  if (await fileExists(binPath)) return binPath;

  return null;
}
