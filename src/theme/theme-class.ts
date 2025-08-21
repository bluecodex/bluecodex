import chalk from "chalk";
import path from "node:path";

import type { Alias } from "../alias/alias";
import type { Arg } from "../arg/arg";
import type { Command } from "../command/command";
import type { Flag } from "../flag/flag";
import { ioc } from "../ioc";
import { ParseArgvMalformattedInputError } from "../parse-argv/errors/parse-argv-malformatted-input-error";

export class ThemeClass {
  /*
   * Colors
   */

  styleDim(text: string) {
    return chalk.dim(text);
  }

  stylePrimary(text: string) {
    return chalk.blueBright(text);
  }

  styleLocal(text: string) {
    return chalk.magenta(text);
  }

  styleBold(text: string) {
    return chalk.bold(text);
  }

  styleShell(text: string) {
    return chalk.yellowBright(text);
  }

  styleSuccess(text: string) {
    return chalk.greenBright(text);
  }

  styleWarning(text: string) {
    return chalk.yellowBright(text);
  }

  styleError(text: string) {
    return chalk.redBright(text);
  }

  /*
   * Data type
   */

  rangeText({ min, max }: { min: number | null; max: number | null }) {
    if (min === null) return `<= ${max}`;
    if (max === null) return `>= ${min}`;
    return `>= ${min} and <= ${max}`;
  }

  /*
   * Arg
   */

  requiredArgName(arg: Arg) {
    return arg.name;
  }

  optionalArgName(arg: Arg) {
    return this.styleDim(`${arg.name}?`);
  }

  argType(arg: Arg) {
    return this.styleDim(`:${arg.type}`);
  }

  argFallback(arg: Arg) {
    if (arg.fallback === null) return;
    return this.styleDim(`=${arg.fallback}`);
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

    return flag.required ? text : this.styleDim(text);
  }

  flagShort(flag: Flag) {
    if (!flag.short) return;

    return this.styleDim(`(-${flag.short})`);
  }

  flagType(flag: Flag) {
    return this.styleDim(`:${flag.type}`);
  }

  flagFallback(flag: Flag) {
    if (flag.fallback === null) return;

    return this.styleDim(`=${flag.fallback}`);
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
      return `${this.styleLocal("⎇")} ${this.stylePrimary(`${command.blueprint.name}`)}`;
    }

    return this.stylePrimary(`⎇ ${command.blueprint.name}`);
  }

  commandParts(command: Command) {
    return command.blueprint.fields
      .map((part) =>
        part.__objectType__ === "flag" ? this.flag(part) : this.arg(part),
      )
      .filter(Boolean)
      .join(" ");
  }

  embeddedCommandGroupTitle() {
    return this.styleDim(this.stylePrimary("§ bluecodex"));
  }

  ungroupedCommandGroupTitle() {
    return this.styleDim(this.stylePrimary("∅ no group"));
  }

  commandGroupTitle(title: string) {
    return this.styleDim(`${this.stylePrimary("⧉")} ${title}`);
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
      this.styleDim("└ "),
      aliases.map((alias) => ioc.theme.aliasName(alias)).join(" "),
    ].join("");

    const descriptionLine =
      command.schema.description &&
      ["    ", this.styleDim(`└ ${command.schema.description}`)].join("");

    return [firstLine, aliases.length > 0 && aliasesLine, descriptionLine]
      .filter(Boolean)
      .join("\n");
  }

  aliasName(alias: Alias) {
    if (alias.meta.local) {
      return `${this.styleLocal("⌁")} ${this.stylePrimary(`${alias.name}`)}`;
    }

    return this.stylePrimary(`⌁ ${alias.name}`);
  }

  aliasTarget(alias: Alias) {
    return alias.target;
  }

  alias(alias: Alias) {
    return this.aliasName(alias) + this.styleDim("=") + this.aliasTarget(alias);
  }

  shellAliasesGroupTitle() {
    return this.styleDim(`${this.stylePrimary("$")} Shell aliases`);
  }

  commandOrAliasNotFound(name: string) {
    return `Command or alias ${this.styleError(`⎇ ${name}`)} not found`;
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
    return this.styleShell(`$ ${name}`);
  }

  runPackageBinName(name: string) {
    return this.styleShell(`$ ${name}`);
  }

  runArgv(argv: string[]) {
    return argv.join(" ");
  }

  runSpawn(name: string, argv: string[]) {
    return this.styleDim(
      [this.runBinName(name), this.runArgv(argv)].filter(Boolean).join(" "),
    );
  }

  runSpawnPackageBin(name: string, argv: string[]) {
    return this.styleDim(
      [this.runPackageBinName(name), this.runArgv(argv)]
        .filter(Boolean)
        .join(" "),
    );
  }

  runCommand(command: Command, argv: string[]) {
    return this.styleDim(
      [this.commandName(command), this.runArgv(argv)].filter(Boolean).join(" "),
    );
  }

  runNotFound(name: string) {
    return (
      this.styleError("[error]") +
      ` ${name} was not found.\n` +
      this.styleDim(
        "It's not in your $PATH, an npm package executable, or a bluecodex command.",
      )
    );
  }

  /*
   * Parse argv
   */

  parseArgvMalformattedInputErrorMessage(
    error: ParseArgvMalformattedInputError,
  ) {
    return `Invalid input ${this.styleError(error.input)} for ${error.field.__objectType__} ${this.styleBold(`${error.field.name}:${error.field.type}`)}`;
  }

  /*
   * File
   */

  relativePath(filePath: string) {
    return path.relative(ioc.project.rootPath, filePath);
  }

  fileCreated(filePath: string) {
    return this.styleSuccess(`+ ${this.relativePath(filePath)} created`);
  }

  fileUpdated(filePath: string) {
    return this.styleSuccess(`◉ ${this.relativePath(filePath)} updated`);
  }

  fileDeleted(filePath: string) {
    return this.styleSuccess(`- ${this.relativePath(filePath)} deleted`);
  }
}
