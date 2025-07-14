import chalk from "chalk";
import path from "node:path";

import type { Arg } from "../arg/arg";
import type { Blueprint } from "../blueprint/blueprint";
import type { Command } from "../command/command";
import type { Flag } from "../flag/flag";
import { ioc } from "../ioc";

export class Theme {
  /*
   * Arg
   */

  requiredArgName(arg: Arg) {
    return arg.name;
  }

  optionalArgName(arg: Arg) {
    return chalk.dim(`${arg.name}?`);
  }

  argType(arg: Arg) {
    return chalk.dim(`:${arg.type}`);
  }

  argFallback(arg: Arg) {
    if (arg.fallback === null) return;
    return chalk.dim(`=${arg.fallback}`);
  }

  arg(arg: Arg) {
    return [
      arg.optional ? this.optionalArgName(arg) : this.requiredArgName(arg),
      this.argType(arg),
      this.argFallback(arg),
    ]
      .filter(Boolean)
      .join("");
  }

  /*
   * Flag
   */

  flagName(flag: Flag) {
    const text = [
      flag.short === true ? "-" : "--",
      flag.name,
      flag.required && "!",
    ]
      .filter(Boolean)
      .join("");

    return flag.required ? text : chalk.dim(text);
  }

  flagShort(flag: Flag) {
    if (!flag.short) return;

    return chalk.dim(`(-${flag.short})`);
  }

  flagType(flag: Flag) {
    return chalk.dim(`:${flag.type}`);
  }

  flagFallback(flag: Flag) {
    if (flag.fallback === null) return;

    return chalk.dim(`=${flag.fallback}`);
  }

  flag(flag: Flag) {
    return [
      this.flagName(flag),
      this.flagShort(flag),
      this.flagType(flag),
      this.flagFallback(flag),
    ]
      .filter(Boolean)
      .join("");
  }

  /*
   * Blueprint
   */

  blueprintName(blueprint: Blueprint) {
    return `${chalk.blueBright(`⎇ ${blueprint.name}`)}`;
  }

  blueprintNameNotFound(name: string) {
    return `${chalk.redBright(`⎇ ${name}`)}`;
  }

  blueprintParts(blueprint: Blueprint) {
    return blueprint.parts
      .map((part) =>
        part.__objectType__ === "flag" ? this.flag(part) : this.arg(part),
      )
      .filter(Boolean)
      .join(" ");
  }

  blueprint(blueprint: Blueprint) {
    return [" ", this.blueprintName(blueprint), this.blueprintParts(blueprint)]
      .filter(Boolean)
      .join(" ");
  }

  /*
   * Command
   */

  commandGroupTitle(title: string) {
    return chalk.dim(`${chalk.blueBright("⧉")} ${title}`);
  }

  commandGroupSubtitle(text: string) {
    return chalk.blue.italic.dim(text);
  }

  commandGroup(title: string, help: string | null) {
    return [
      this.commandGroupTitle(title),
      help && this.commandGroupSubtitle(help),
    ]
      .filter(Boolean)
      .join(" ");
  }

  command(command: Command) {
    if (command.meta.todo) return;

    return this.blueprint(command.blueprint);
  }

  /*
   * Run
   */

  runBin(bin: string) {
    return chalk.yellowBright(bin);
  }

  runArgv(argv: string[]) {
    return argv.join(" ");
  }

  run(bin: string, argv: string[]) {
    return chalk.dim(
      ["$", this.runBin(bin), this.runArgv(argv)].filter(Boolean).join(" "),
    );
  }

  runCommand(name: string, argv: string[]) {
    return chalk.dim(
      [chalk.blueBright(`$ ${name}`), this.runArgv(argv)]
        .filter(Boolean)
        .join(" "),
    );
  }

  /*
   * File
   */

  relativePath(filePath: string) {
    return path.relative(ioc.project.rootPath, filePath);
  }

  fileCreated({
    filePath,
    relativeToProjectRoot,
  }: {
    filePath: string;
    relativeToProjectRoot: boolean;
  }) {
    const resolvedPath = relativeToProjectRoot
      ? this.relativePath(filePath)
      : filePath;

    return chalk.greenBright(resolvedPath);
  }
}
