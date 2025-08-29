import fs from "node:fs/promises";

import { file } from "../file/file";
import { configFile } from "./config-file";

export async function saveConfigResolver() {
  const resolverMjsFile = file(import.meta.dirname, "config-resolver.mjs");

  const resolverFile = configFile("resolver.mjs");
  await resolverFile.save(await resolverMjsFile.read());
  fs.chmod(resolverFile.filename, 0o755);
}
