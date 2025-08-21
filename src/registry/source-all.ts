import os from "node:os";

import { ioc } from "../ioc";
import { getLinks } from "../link/get-links";
import { getProjectPatterns } from "../registry/get-project-patterns";
import { source } from "../registry/source";

async function sourceProject() {
  for (const pattern of getProjectPatterns(ioc.project.rootPath)) {
    await source(pattern);
  }
}

async function sourceHome() {
  await ioc.registry.markingAsLocal(async () => {
    for (const pattern of getProjectPatterns(os.homedir())) {
      await source(pattern);
    }
  });
}

async function sourceLinks() {
  await ioc.registry.markingAsLocal(async () => {
    const originalCwd = process.cwd();

    const links = await getLinks();
    for (const link of links) {
      process.chdir(link);

      for (const pattern of getProjectPatterns(link)) {
        await source(pattern);
      }
    }

    process.chdir(originalCwd);
  });
}

export async function sourceAll() {
  await sourceProject();
  await sourceHome();
  await sourceLinks();
}
