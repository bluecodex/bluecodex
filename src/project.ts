import fs from "node:fs";
import path from "node:path";

export class Project {
  path: string;

  constructor(args: { path: string }) {
    this.path = args.path;
  }

  get bluecodexFilePath() {
    return path.join(this.path, "bluecodex.ts");
  }

  get bluecodexFileExists() {
    return fs.existsSync(this.bluecodexFilePath);
  }
}
