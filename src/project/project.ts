import path from "node:path";

export class Project {
  constructor(readonly rootPath: string) {}

  get blueFolderPath() {
    return path.join(this.rootPath, ".blue/");
  }

  get localBlueFolderPath() {
    return path.join(this.blueFolderPath, "local/");
  }
}
