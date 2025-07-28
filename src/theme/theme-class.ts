import chalk from "chalk";
import path from "node:path";

import type { Alias } from "../alias/alias";
import type { Arg } from "../arg/arg";
import type { Command } from "../command/command";
import type { Flag } from "../flag/flag";
import { ioc } from "../ioc";

export class ThemeClass {
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

  command(command: Command, aliases: Alias[]) {
    const firstLine = [
      " ",
      this.commandName(command),
      this.commandParts(command),
    ]
      .filter(Boolean)
      .join(" ");

    const aliasesLine = [
      "    ",
      chalk.dim("└ "),
      aliases.map((alias) => ioc.theme.aliasName(alias)).join(" "),
    ].join("");

    return [firstLine, aliases.length > 0 && aliasesLine]
      .filter(Boolean)
      .join("\n");
  }

  aliasName(alias: Alias) {
    if (alias.meta.local) {
      return `${chalk.magenta("⌁")}${chalk.blueBright(`${alias.name}`)}`;
    }

    return chalk.blueBright(`⌁ ${alias.name}`);
  }

  aliasTarget(alias: Alias) {
    return alias.target;
  }

  alias(alias: Alias) {
    return this.aliasName(alias) + chalk.dim("=") + this.aliasTarget(alias);
  }

  shellAliasesGroupTitle() {
    return chalk.dim(`${chalk.blueBright("$")} Shell aliases`);
  }

  commandOrAliasNotFound(name: string) {
    return `Command or alias ${chalk.redBright(`⎇ ${name}`)} not found`;
  }

  commandAlreadyRegisteredMessage(command: Command) {
    return `Command with name "${command.blueprint.name}" already exists.`;
  }

  aliasAlreadyRegisteredMessage(commandAlis: Alias) {
    return `Alias with name "${commandAlis.name}" already exists.`;
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
