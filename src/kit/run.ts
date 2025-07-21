import { spawn } from "node:child_process";

import type { RawCmd } from "../cli/raw-cmd";
import { resolveBin } from "../cli/resolve-bin";
import { runCommand } from "../command/run-command";
import { ioc } from "../ioc";

function spawnPromise(cmd: string, argv: string[]) {
  return new Promise<number>((resolve) => {
    const child = spawn(cmd, argv, { stdio: "inherit" });

    child.on("close", (code) => {
      resolve(code ?? 1);
    });

    child.on("error", () => {
      resolve(1);
    });
  });
}

/**
 * Runs a command asynchronously and returns the exit code
 */
export async function run(rawCmd: RawCmd): Promise<number> {
  const resolvedBin = resolveBin(rawCmd);

  switch (resolvedBin.type) {
    case "command": {
      const command = ioc.registry.findCommand(resolvedBin.name);
      if (!command) {
        console.log(ioc.theme.commandNotFound(resolvedBin.name));
        return 1;
      }

      console.log(ioc.theme.runCommand(command, resolvedBin.argv));
      await runCommand(resolvedBin.name, resolvedBin.argv);
      return 0;
    }

    case "spawn": {
      console.log(ioc.theme.runSpawn(resolvedBin.name, resolvedBin.argv));
      return spawnPromise(resolvedBin.name, resolvedBin.argv);
    }

    case "spawn-package-bin": {
      console.log(
        ioc.theme.runSpawnPackageBin(resolvedBin.name, resolvedBin.argv),
      );
      return spawnPromise(resolvedBin.path, resolvedBin.argv);
    }

    case "not-found": {
      console.log(ioc.theme.runBinNotFound(resolvedBin.name));
      return 1;
    }
  }
}
