import which from "which";

import { fileExists } from "../utils/fileExists";
import type { SpawnTarget } from "./spawn-target";

export async function checkBinSpawnTarget(
  name: string,
  argv: string[],
): Promise<SpawnTarget | null> {
  const binExists = await which(name, { nothrow: true });
  if (binExists) return { type: "bin", name, argv } as const;

  const packageBinPath = `node_modules/.bin/${name}`;
  if (await fileExists(packageBinPath)) {
    return {
      type: "package-bin",
      name,
      path: packageBinPath,
      argv,
    } as const;
  }

  return null;
}
