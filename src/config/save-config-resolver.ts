import Bun from "bun";
import fs from "node:fs/promises";

import { file } from "../file/file";
import { configFile } from "./config-file";

export async function saveConfigResolver() {
  const { outputs } = await Bun.build({
    entrypoints: [file(__dirname, "config-resolver.ts").path],
    target: "node",
  });

  const bundleContents = await outputs[0].text();
  const resolverFile = configFile("resolver.mjs");
  await resolverFile.save([bundleContents].join("\n"));

  fs.chmod(resolverFile.path, 0o755);
}
