import fs from "node:fs";
import which from "which";

import { ioc } from "../ioc";
import type { RunTarget } from "./run-target";
import { tightenLooseArgv } from "./tighten-loose-argv";

async function resolveRunTargetBinOrLocalBin(name: string, argv: string[]) {
  const binExists = await which(name, { nothrow: true });
  if (binExists) return { type: "spawn", name, argv } as const;

  const packageBinPath = `node_modules/.bin/${name}`;
  if (fs.existsSync(packageBinPath)) {
    return {
      type: "spawn-package-bin",
      name,
      path: packageBinPath,
      argv,
    } as const;
  }
}

/**
 * When the first param is `blue` or `bluecodex` we must either resolve to
 * a command, a command-alias or not-found
 */
async function resolveRunTargetFromBlueRawCmd(name: string, argv: string[]) {
  const commandOrAlias = ioc.registry.findCommandOrAlias(name);

  if (commandOrAlias) {
    if (commandOrAlias.__objectType__ === "command") {
      // commandOrAlias is command
      const command = commandOrAlias;

      return {
        type: "command",
        name,
        argv,
        command,
      } as const;
    }

    // commandOrAlias is alias
    const alias = commandOrAlias;

    const aliasedCommand = ioc.registry.findAliasedCommand(alias);
    if (aliasedCommand) {
      return {
        type: "command",
        name,
        argv,
        command: aliasedCommand,
      } as const;
    }

    const [firstAliasArgv, ...remainingAliasArgv] = argv;
    const binOrLocalBin = await resolveRunTargetBinOrLocalBin(
      firstAliasArgv,
      remainingAliasArgv,
    );

    if (binOrLocalBin) return binOrLocalBin;
  }

  return { type: "not-found", name: name } as const;
}

export async function resolveRunTarget(argv: string[]): Promise<RunTarget> {
  const [name, ...targetArgv] = tightenLooseArgv(argv);

  if (name === "blue" || name === "bluecodex") {
    const [firstBlueArgv, ...remainingBlueArgv] = targetArgv;
    return resolveRunTargetFromBlueRawCmd(firstBlueArgv, remainingBlueArgv);
  }

  const binOrLocalBin = await resolveRunTargetBinOrLocalBin(name, targetArgv);
  if (binOrLocalBin) return binOrLocalBin;

  const commandOrAlias = ioc.registry.findCommandOrAlias(name);

  if (commandOrAlias) {
    if (commandOrAlias.__objectType__ === "command") {
      // commandOrAlias is command
      const command = commandOrAlias;
      return {
        type: "command",
        name: name,
        argv: targetArgv,
        command,
      } as const;
    }

    // commandOrAlias is alias
    const alias = ioc.registry.findEndAlias(commandOrAlias);

    const aliasedCommand = ioc.registry.findAliasedCommand(alias);
    if (aliasedCommand) {
      return {
        type: "command",
        name: name,
        argv: targetArgv,
        command: aliasedCommand,
      } as const;
    }

    const [aliasTargetName, ...aliasTargetArgv] = alias.target.split(" ");
    const aliasBinOrLocalBin = await resolveRunTargetBinOrLocalBin(
      aliasTargetName,
      aliasTargetArgv,
    );

    if (aliasBinOrLocalBin) return aliasBinOrLocalBin;
  }

  return { type: "not-found", name } as const;
}
