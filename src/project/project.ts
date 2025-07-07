import fs from "node:fs";
import path from "node:path";

import { ioc } from "../ioc";

export class Project {
  constructor(readonly config: { path: string }) {}

  get dotBluecodexFolderPath() {
    return path.join(this.config.path, ".bluecodex/");
  }

  get bluecodexFilePath() {
    return path.join(this.dotBluecodexFolderPath, "bluecodex.ts");
  }

  get relativeBluecodexFilePath() {
    return path.relative(this.config.path, this.bluecodexFilePath);
  }

  get defaultSourcesPattern() {
    return [".bluecodex/bluecodex.{ts,tsx}", ".bluecodex/**/*.bcx.{ts,tsx}"];
  }

  get defaultSources() {
    const files = new Set<string>();

    this.defaultSourcesPattern.forEach((pattern) => {
      const globbedFiles = fs.globSync(
        path.join(ioc.project.config.path, pattern),
      );

      globbedFiles.forEach((file) => files.add(file));
    });

    return Array.from(files);
  }

  get isInitialized() {
    return this.defaultSources.length > 0;
  }
}
