import path from "node:path";
import which from "which";

import type { SpawnTarget } from "../spawn/spawn-target";
import { fileExists } from "../utils/fileExists";

export async function checkRunSpawnTarget(
  name: string,
  argv: string[],
): Promise<SpawnTarget | null> {
  const binFound = await which(name, { nothrow: true });
  const packageBinPath = `node_modules/.bin/${name}`;

  // During tests node_modules/.bin/ is included in the PATH=
  //
  // To get around that and allow testing package-bin we check if the binary
  // found is in that folder
  const binFoundInPackage =
    binFound && binFound === path.resolve(packageBinPath);

  if (binFound && !binFoundInPackage)
    return { type: "bin", name, argv } as const;

  if (binFoundInPackage || (await fileExists(packageBinPath))) {
    return {
      type: "package-bin",
      name,
      path: packageBinPath,
      argv,
    } as const;
  }

  return null;
}
