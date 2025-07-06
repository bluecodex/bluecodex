import fs from "node:fs";
import path from "node:path";

export class Project {
  constructor(readonly config: { path: string }) {}

  get bluecodexFilePath() {
    return path.join(this.config.path, "bluecodex.ts");
  }

  get bluecodexFileExists() {
    return fs.existsSync(this.bluecodexFilePath);
  }
}
