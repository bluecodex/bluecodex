import fs from "node:fs";
import path from "node:path";

export class Project {
  constructor(readonly config: { path: string }) {}

  get bluecodexFilePath() {
    const rootFilePath = path.join(this.config.path, "bluecodex.ts");
    if (fs.existsSync(rootFilePath)) return rootFilePath;

    const dotBluecodexFilePath = path.join(
      this.config.path,
      ".bluecodex/bluecodex.ts",
    );
    if (fs.existsSync(dotBluecodexFilePath)) return dotBluecodexFilePath;

    return dotBluecodexFilePath;
  }

  get relativeBluecodexFilePath() {
    return path.relative(this.config.path, this.bluecodexFilePath);
  }

  get bluecodexFileExists() {
    return fs.existsSync(this.bluecodexFilePath);
  }
}
