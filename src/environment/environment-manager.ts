import fs from "node:fs";
import path from "node:path";

import { ioc } from "../ioc";

export class EnvironmentManager {
  get path() {
    return path.join(ioc.project.dotBluecodexFolderPath, ".env.bluecodex");
  }

  get templatePath() {
    return path.join(
      ioc.project.dotBluecodexFolderPath,
      ".env.bluecodex.template",
    );
  }

  get isInitialized() {
    return fs.existsSync(this.path);
  }
}
