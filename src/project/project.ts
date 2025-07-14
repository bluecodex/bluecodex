import fs from "node:fs";
import path from "node:path";

export class Project {
  constructor(readonly config: { path: string }) {}

  get blueFolderPath() {
    return path.join(this.config.path, ".blue/");
  }

  ensureBlueFolderExists() {
    if (!fs.existsSync(this.blueFolderPath)) {
      fs.mkdirSync(this.blueFolderPath);
    }
  }

  relativePath(target: string) {
    return path.relative(this.config.path, target);
  }

  get defaultSourcesPattern() {
    return ["blue.{ts,tsx}", ".blue/**/*.blue.{ts,tsx}", "**/*.blue.{ts,tsx}"];
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
