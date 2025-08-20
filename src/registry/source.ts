import fs from "node:fs/promises";
import path from "node:path";

import { ioc } from "../ioc";
import { fileExists } from "../utils/fileExists";

export async function source(pattern: string) {
  const files =
    !pattern.includes("*") || (await fileExists(pattern))
      ? [pattern]
      : fs.glob(path.join(ioc.project.config.path, pattern));

  for await (const file of files) {
    const isLocalOnlyFile = file.startsWith(ioc.project.localBlueFolderPath);

    if (isLocalOnlyFile) {
      await ioc.registry.markingAsLocal(async () => {
        await import(file);
      });
    } else {
      await import(file);
    }
  }

  return files;
}
