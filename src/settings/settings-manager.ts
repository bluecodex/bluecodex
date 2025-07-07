import fs from "node:fs";
import path from "node:path";

import { ioc } from "../ioc";
import type { Settings } from "./settings";

export class SettingsManager {
  get settingsPath() {
    return path.join(
      ioc.project.dotBluecodexFolderPath,
      "bluecodex-settings.json",
    );
  }

  get settings(): Settings {
    if (!fs.existsSync(this.settingsPath)) return {};

    const contents = fs.readFileSync(this.settingsPath, "utf-8");
    return JSON.parse(contents) as Settings;
  }

  setSetting<S extends keyof Settings>(name: S, value: Settings[S]) {
    fs.writeFileSync(
      this.settingsPath,
      JSON.stringify({ ...this.settings, [name]: value }),
    );
  }
}
