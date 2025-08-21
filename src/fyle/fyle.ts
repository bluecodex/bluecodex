import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ioc } from "../ioc";

export class Fyle {
  readonly path: string;

  constructor(filePath: string) {
    this.path = path.resolve(filePath);
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
      return path.relative(homedir, this.path);
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

export function fyle(...filePath: string[]): Fyle {
  return new Fyle(path.join(...filePath));
}

fyle.glob = async (pattern: string): Promise<Fyle[]> => {
  const filePathsIterator = fs.glob(pattern);

  const files: Fyle[] = [];

  try {
    for await (const filePath of filePathsIterator) {
      files.push(fyle(filePath));
    }
  } catch {
    // do nothing
  }

  return files;
};
