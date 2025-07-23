import chalk from "chalk";
import path from "node:path";

import type { Arg } from "../arg/arg";
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

  invalidArgInputErrorMessage(arg: Arg, input: string) {
    return `Invalid input ${chalk.redBright(input)} for arg ${chalk.bold(`${arg.name}:${arg.type}`)}`;
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
   * Command
   */

  commandName(command: Command) {
    if (command.meta.local) {
      return `${chalk.magenta("⎇")} ${chalk.blueBright(`${command.blueprint.name}`)}`;
    }

    return chalk.blueBright(`⎇ ${command.blueprint.name}`);
  }

  commandParts(command: Command) {
    return command.blueprint.parts
      .map((part) =>
        part.__objectType__ === "flag" ? this.flag(part) : this.arg(part),
      )
      .filter(Boolean)
      .join(" ");
  }

  embeddedCommandGroupTitle() {
    return chalk.dim(chalk.blueBright("§ bluecodex"));
  }

  ungroupedCommandGroupTitle() {
    return chalk.dim(chalk.blueBright("∅ no group"));
  }

  commandGroupTitle(title: string) {
    return chalk.dim(`${chalk.blueBright("⧉")} ${title}`);
  }

  command(command: Command) {
    if (command.meta.todo) return;

    return [" ", this.commandName(command), this.commandParts(command)]
      .filter(Boolean)
      .join(" ");
  }

  commandNotFound(name: string) {
    return `Command ${chalk.redBright(`⎇ ${name}`)} not found`;
  }

  /*
   * Run
   */

  runBinName(name: string) {
    return chalk.yellowBright(`$ ${name}`);
  }

  runPackageBinName(name: string) {
    return chalk.yellowBright(`$ ${name}`);
  }

  runBinNotFound(name: string) {
    return `${chalk.redBright(`${name}`)} not found`;
  }

  runArgv(argv: string[]) {
    return argv.join(" ");
  }

  runSpawn(name: string, argv: string[]) {
    return chalk.dim(
      [this.runBinName(name), this.runArgv(argv)].filter(Boolean).join(" "),
    );
  }

  runSpawnPackageBin(name: string, argv: string[]) {
    return chalk.dim(
      [this.runPackageBinName(name), this.runArgv(argv)]
        .filter(Boolean)
        .join(" "),
    );
  }

  runCommand(command: Command, argv: string[]) {
    return chalk.dim(
      [this.commandName(command), this.runArgv(argv)].filter(Boolean).join(" "),
    );
  }

  runNotFound(name: string) {
    return (
      chalk.redBright("[error]") +
      ` ${name} was not found.\n` +
      chalk.dim(
        "It's not in your $PATH, an npm package executable, or a bluecodex command.",
      )
    );
  }

  /*
   * File
   */

  relativePath(filePath: string) {
    return path.relative(ioc.project.rootPath, filePath);
  }

  fileCreated(filePath: string) {
    return chalk.greenBright(`+ ${this.relativePath(filePath)} created`);
  }

  fileUpdated(filePath: string) {
    return chalk.cyanBright(`◉ ${this.relativePath(filePath)} updated`);
  }

  fileDeleted(filePath: string) {
    return chalk.redBright(`- ${this.relativePath(filePath)} deleted`);
  }
}
