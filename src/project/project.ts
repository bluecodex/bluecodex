import fs from "node:fs";
import path from "node:path";

export class Project {
  constructor(readonly config: { path: string }) {}

  get rootPath() {
    return this.config.path;
  }

  get blueFolderPath() {
    return path.join(this.config.path, ".blue/");
  }

  get localBlueFolderPath() {
    return path.join(this.blueFolderPath, "local/");
  }

  get defaultSourcesPattern() {
    return [
      "bluecodex.{js,jsx,ts,tsx}",
      "blue.{js,jsx,ts,tsx}",
      ".blue/blue.{js,jsx,ts,tsx}",
      ".blue/**/*.blue.{js,jsx,ts,tsx}",
    ];
  }

  get sources() {
    const files = new Set<string>();

    this.defaultSourcesPattern.forEach((pattern) => {
      try {
        const globbedFiles = fs.globSync(path.join(this.config.path, pattern));
        globbedFiles.forEach((file) => files.add(file));
      } catch {
        // do nothing if globbing a folder fails
      }
    });

    return Array.from(files);
  }

  get isInitialized() {
    return this.sources.length > 0;
  }
}
