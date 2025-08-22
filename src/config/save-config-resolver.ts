import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { file } from "../file/file";
import { configFile } from "./config-file";

export async function saveConfigResolver() {
  const resolverMjsFile = file(
    path.dirname(fileURLToPath(import.meta.url)),
    "config-resolver.mjs",
  );

  const resolverFile = configFile("resolver.mjs");
  await resolverFile.save(await resolverMjsFile.read());
  fs.chmod(resolverFile.path, 0o755);
}
