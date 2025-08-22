import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ioc } from "../ioc";
import type { LooseFilePath } from "./loose-file-path";
import { tightenLooseFilePath } from "./tighten-loose-file-path";

export class File {
  readonly path: string;

  constructor(...looseFilePath: LooseFilePath) {
    this.path = tightenLooseFilePath(looseFilePath);
  }

  /**
   * Create a new File using a path relative to this one
   * @param looseFilePath
   */
  relative(...looseFilePath: LooseFilePath): File {
    return new File(looseFilePath);
  }

  /**
   * If this file is within the project, show a relative path.
   *
   * If it's within the user dir ~/..., show ~/...relative
   *
   * Otherwise, show the absolute path
   */
  get prettyPath() {
    if (this.path.startsWith(ioc.project.rootPath)) {
      return path.relative(ioc.project.rootPath, this.path);
    }

    const homedir = os.homedir();
    if (this.path.startsWith(homedir)) {
      return "~/" + path.relative(homedir, this.path);
    }

    return this.path;
  }

  get dirname(): string {
    return path.dirname(this.path);
  }

  get basename(): string {
    return path.basename(this.path);
  }

  get extname(): string {
    return path.extname(this.path);
  }

  async exists(): Promise<boolean> {
    try {
      await fs.access(this.path, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async read(): Promise<string> {
    return fs.readFile(this.path, {
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
    await fs.writeFile(this.path, contents);

    if (!options?.skipLog) {
      console.log(
        alreadyExisted
          ? ioc.theme.fileUpdated(this.prettyPath)
          : ioc.theme.fileCreated(this.prettyPath),
      );
    }
  }
}

export function file(...looseFilePath: LooseFilePath): File {
  return new File(looseFilePath);
}

file.glob = async (pattern: string): Promise<File[]> => {
  const filePathsIterator = fs.glob(pattern);

  const files: File[] = [];

  try {
    for await (const filePath of filePathsIterator) {
      files.push(file(filePath));
    }
  } catch {
    // do nothing
  }

  return files;
};
