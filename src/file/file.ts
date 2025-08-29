import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ioc } from "../ioc";
import type { LooseFilename } from "./loose-filename";
import { tightenLooseFilename } from "./tighten-loose-filename";

export class File {
  readonly filename: string;

  constructor(...looseFilename: LooseFilename) {
    this.filename = tightenLooseFilename(looseFilename);
  }

  /**
   * If this file is within the project, show a relative path.
   *
   * If it's within the user dir ~/..., show ~/...relative
   *
   * Otherwise, show the absolute path
   */
  get prettyPath() {
    if (this.filename.startsWith(ioc.project.rootPath)) {
      return path.relative(ioc.project.rootPath, this.filename);
    }

    if (this.filename.startsWith(os.homedir())) {
      return this.tildePath;
    }

    return this.filename;
  }

  get tildePath() {
    return "~/" + path.relative(os.homedir(), this.filename);
  }

  get dirname(): string {
    return path.dirname(this.filename);
  }

  get basename(): string {
    return path.basename(this.filename);
  }

  get extname(): string {
    return path.extname(this.filename);
  }

  async exists(): Promise<boolean> {
    try {
      await fs.access(this.filename, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async read(): Promise<string> {
    return fs.readFile(this.filename, {
      encoding: "utf-8",
    });
  }

  async readLines(): Promise<string[]> {
    const contents = await this.read();
    return contents.split(/\r?\n/);
  }

  /**
   * Passing an array is equivalent to `.join('\n')`
   */
  async save(rawContents: string | string[], options?: { skipLog?: boolean }) {
    const contents = Array.isArray(rawContents)
      ? rawContents.join("\n")
      : rawContents;

    await fs.mkdir(this.dirname, { recursive: true });

    const alreadyExisted = await this.exists();
    await fs.writeFile(this.filename, contents);

    if (!options?.skipLog) {
      console.log(
        alreadyExisted
          ? ioc.theme.fileUpdated(this.prettyPath)
          : ioc.theme.fileCreated(this.prettyPath),
      );
    }
  }
}

export function file(...looseFilename: LooseFilename): File {
  return new File(looseFilename);
}

file.glob = async (pattern: string): Promise<File[]> => {
  const filenamesIterator = fs.glob(pattern);

  const files: File[] = [];

  try {
    for await (const filename of filenamesIterator) {
      files.push(file(filename));
    }
  } catch {
    // do nothing
  }

  return files;
};
