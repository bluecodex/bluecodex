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
    return [".bluecodex/bluecodex.ts", ".bluecodex/**/*.bcx.(ts|tsx)"];
  }

  get defaultSources() {
    return fs.globSync(
      this.defaultSourcesPattern.map((pattern) =>
        path.join(ioc.project.config.path, pattern),
      ),
    );
  }

  get isInitialized() {
    return this.defaultSources.length > 0;
  }
}
