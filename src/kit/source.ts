import fs from "node:fs";
import path from "node:path";

import { ioc } from "../ioc";

export async function source(pattern: string) {
  const files = fs.globSync(path.join(ioc.project.config.path, pattern));

  for (const file of files) {
    await import(file);
  }

  return files;
}
