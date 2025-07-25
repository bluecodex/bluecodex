import fs from "node:fs";
import path from "node:path";

import { ioc } from "../ioc";

export async function source(pattern: string) {
  const files =
    !pattern.includes("*") || fs.existsSync(pattern)
      ? [pattern]
      : fs.globSync(path.join(ioc.project.config.path, pattern));

  for (const file of files) {
    const isLocalOnlyFile = file.startsWith(ioc.project.localBlueFolderPath);

    if (isLocalOnlyFile) {
      await ioc.registry.markingRegisteredCommandsAsLocal(async () => {
        await import(file);
      });
    } else {
      await import(file);
    }
  }

  return files;
}
