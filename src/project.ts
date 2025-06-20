import fs from "node:fs";
import path from "node:path";

import type { Command } from "./command";
import { ioc } from "./ioc";

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

  get groupedCommands(): Record<string, Command[]> {
    const { commands } = ioc.commandRegistry;

    const groups: Record<string, Command[]> = {};

    commands.forEach((command) => {
      const [first, ...rest] = command.blueprint.name.split(":");

      const groupName = rest.length > 0 ? first : "";
      groups[groupName] ||= [];
      groups[groupName].push(command);
    });

    return groups;
  }
}
