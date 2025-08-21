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
    if (commandOrAlias.__objectType__ === "alias") {
      const alias = commandOrAlias; // it's an alias
      return runArgvToSpawnTarget([alias.target, argv]);
    }

    const command = commandOrAlias; // it's a command
    return {
      type: "command",
      name,
      argv,
      command,
    } as const;
  }

  return { type: "not-found", name, argv } as const;
}
