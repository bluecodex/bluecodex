import { ioc } from "../ioc";
import { checkBinSpawnTarget } from "../spawn/check-bin-spawn-target";
import type { SpawnTarget } from "../spawn/spawn-target";
import type { LooseArgv } from "./loose-argv";
import { tightenLooseArgv } from "./tighten-loose-argv";

export async function runArgvToSpawnTarget(
  looseArgv: LooseArgv,
): Promise<SpawnTarget> {
  const tightArgv = tightenLooseArgv(looseArgv);

  // When invoked with `blue` or `bluecodex` skip checking for bin
  const hasBluePrefix = ["blue", "bluecodex"].includes(tightArgv[0]);

  const [name, ...argv] = hasBluePrefix ? tightArgv.slice(1) : tightArgv;

  if (!hasBluePrefix) {
    const binOrLocalBin = await checkBinSpawnTarget(name, argv);
    if (binOrLocalBin) return binOrLocalBin;
  }

  const commandOrAlias = ioc.registry.findCommandOrAlias(name);

  if (commandOrAlias) {
    if (commandOrAlias.__objectType__ === "command") {
      // commandOrAlias is command
      const command = commandOrAlias;
      return {
        type: "command",
        name: name,
        argv,
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
        argv,
        command: aliasedCommand,
      } as const;
    }

    const [aliasTargetName, ...aliasTargetArgv] = alias.target.split(" ");
    const aliasBinOrLocalBin = await checkBinSpawnTarget(
      aliasTargetName,
      aliasTargetArgv,
    );

    if (aliasBinOrLocalBin) return aliasBinOrLocalBin;
  }

  return { type: "not-found", name } as const;
}
