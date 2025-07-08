import fs from "node:fs";
import path from "node:path";

import { ioc } from "../ioc";

export class EnvironmentManager {
  get dotEnvPath() {
    return path.join(ioc.project.dotBluecodexFolderPath, ".env.bluecodex");
  }

  get dotEnvTemplatePath() {
    return path.join(
      ioc.project.dotBluecodexFolderPath,
      ".env.bluecodex.template",
    );
  }

  get canInitialize() {
    return fs.existsSync(this.dotEnvTemplatePath);
  }

  get isInitialized() {
    return fs.existsSync(this.dotEnvPath);
  }

  get shouldInitialize() {
    return Boolean(
      this.canInitialize &&
        !this.isInitialized &&
        !ioc.settingsManager.settings.skipInitEnv,
    );
  }
}
